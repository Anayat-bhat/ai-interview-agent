"""
JSON Data Loader Utility Service.

Provides safe loading, error handling, and in-memory caching for curriculum
and candidate JSON data files.
"""

import json
import logging
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, List, Union

logger = logging.getLogger(__name__)


class DataLoaderError(Exception):
    """Base exception for data loader utility errors."""

    pass


class DataFileNotFoundError(DataLoaderError, FileNotFoundError):
    """Exception raised when a requested data file does not exist."""

    pass


class DataFileParseError(DataLoaderError, ValueError):
    """Exception raised when a JSON data file contains invalid syntax."""

    pass


def _resolve_data_file_path(filename: str) -> Path:
    """
    Safely resolve the location of a JSON data file using pathlib.

    Searches standard data directories relative to file location and current working directory.

    Args:
        filename (str): Name or relative path of the file to resolve.

    Returns:
        Path: Resolved absolute path to the data file.

    Raises:
        DataFileNotFoundError: If the file cannot be located.
    """
    base_dir = Path(__file__).resolve().parent

    search_locations = [
        base_dir.parent / "data" / filename,  # e.g., backend/data/filename
        base_dir.parent.parent / "data" / filename,  # e.g., root/data/filename
        Path.cwd() / "data" / filename,  # e.g., cwd/data/filename
        Path.cwd() / filename,  # e.g., cwd/filename
    ]

    for path in search_locations:
        if path.is_file():
            return path

    paths_str = ", ".join(str(p) for p in search_locations)
    raise DataFileNotFoundError(
        f"Required data file '{filename}' was not found. Searched locations: [{paths_str}]"
    )


def _load_json_safely(filename: str) -> Union[Dict[str, Any], List[Any]]:
    """
    Reads and parses a JSON file safely using pathlib.

    Args:
        filename (str): Name of the JSON file to load.

    Returns:
        Union[Dict[str, Any], List[Any]]: Parsed JSON content as a dictionary or list.

    Raises:
        DataFileNotFoundError: If the file does not exist.
        DataFileParseError: If the file contains invalid JSON syntax.
        DataLoaderError: For general I/O errors.
    """
    filepath = _resolve_data_file_path(filename)
    try:
        with filepath.open("r", encoding="utf-8") as file_stream:
            return json.load(file_stream)
    except json.JSONDecodeError as exc:
        logger.error("JSON decode error in file %s: %s", filepath, exc)
        raise DataFileParseError(
            f"Failed to parse JSON file '{filepath}': {exc.msg} at line {exc.lineno} col {exc.colno}"
        ) from exc
    except OSError as exc:
        logger.error("I/O error reading file %s: %s", filepath, exc)
        raise DataLoaderError(f"I/O error reading data file '{filepath}': {exc}") from exc


@lru_cache(maxsize=1)
def load_curriculum() -> Union[Dict[str, Any], List[Any]]:
    """
    Loads data/curriculum.json into memory and caches the result.

    Returns:
        Union[Dict[str, Any], List[Any]]: The parsed curriculum JSON content.
    """
    return _load_json_safely("curriculum.json")


@lru_cache(maxsize=1)
def load_candidates() -> Union[Dict[str, Any], List[Any]]:
    """
    Loads data/candidates.json into memory and caches the result.

    Returns:
        Union[Dict[str, Any], List[Any]]: The parsed candidates JSON content.
    """
    return _load_json_safely("candidates.json")


__all__ = [
    "load_curriculum",
    "load_candidates",
    "DataLoaderError",
    "DataFileNotFoundError",
    "DataFileParseError",
    "_load_json_safely",
]

