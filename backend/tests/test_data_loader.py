import tempfile
import unittest
from pathlib import Path

from services.data_loader import (
    DataFileNotFoundError,
    DataFileParseError,
    DataLoaderError,
    _load_json_safely,
    load_candidates,
    load_curriculum,
)


class TestDataLoader(unittest.TestCase):
    def test_load_curriculum(self):
        curriculum = load_curriculum()
        self.assertIsInstance(curriculum, dict)
        self.assertIn("cohort", curriculum)
        self.assertIn("modules", curriculum)

    def test_load_candidates(self):
        candidates = load_candidates()
        self.assertIsInstance(candidates, dict)
        self.assertIn("candidates", candidates)
        self.assertTrue(len(candidates["candidates"]) > 0)

    def test_in_memory_caching(self):
        c1 = load_curriculum()
        c2 = load_curriculum()
        self.assertIs(c1, c2)

        cand1 = load_candidates()
        cand2 = load_candidates()
        self.assertIs(cand1, cand2)

    def test_missing_file_raises_exception(self):
        with self.assertRaises(DataFileNotFoundError):
            _load_json_safely("non_existent_file_999.json")

    def test_exception_hierarchy(self):
        self.assertTrue(issubclass(DataFileNotFoundError, DataLoaderError))
        self.assertTrue(issubclass(DataFileNotFoundError, FileNotFoundError))
        self.assertTrue(issubclass(DataFileParseError, DataLoaderError))
        self.assertTrue(issubclass(DataFileParseError, ValueError))

    def test_invalid_json_raises_parse_error(self):
        with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as tmp:
            tmp.write("{ invalid_json: ")
            tmp_path = Path(tmp.name)

        try:
            with self.assertRaises(DataFileParseError):
                _load_json_safely(str(tmp_path))
        finally:
            if tmp_path.exists():
                tmp_path.unlink()


if __name__ == "__main__":
    unittest.main()

