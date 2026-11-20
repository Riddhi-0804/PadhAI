"""
End-to-end auth flow proof for PadhAI (MOCK_AI=true, throwaway SQLite database).

Proves:
1. POST /api/auth/register creates two real users and returns real tokens.
2. GET /api/auth/me returns each user's own name/role for that user's token.
3. Logging in as each user (correct password) returns that user's real name.
4. A wrong password returns 401.
5. A duplicate email returns 409 with a clear message.
6. A weak password returns 422.
7. Protected routers reject requests with no token or a bad token with 401.

Run:
    MOCK_AI=true python3 -m unittest backend.tests.test_auth_flow -v
"""
import os
import tempfile
import unittest
import uuid

# Use a throwaway database before backend.config is imported.
_TEST_DIR = tempfile.mkdtemp(prefix="padhai_auth_test_")
os.environ["SQLITE_DB_PATH"] = os.path.join(_TEST_DIR, "padhai_auth_test.db")
os.environ["MOCK_AI"] = "true"

from fastapi.testclient import TestClient  # noqa: E402

from backend.main import app  # noqa: E402


class TestAuthFlow(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.client.__enter__()

        suffix = uuid.uuid4().hex[:8]
        cls.user_one = {
            "name": "Riya Verma",
            "email": f"riya.{suffix}@example.com",
            "password": "Str0ngPass1",
            "role": "student",
        }
        cls.user_two = {
            "name": "Amit Nair",
            "email": f"amit.{suffix}@example.com",
            "password": "An0therPass2",
            "role": "teacher",
        }


    @classmethod
    def tearDownClass(cls):
        cls.client.__exit__(None, None, None)

    def _login(self, user):
        return self.client.post(
            "/api/auth/login",
            json={"email": user["email"], "password": user["password"]},
        )

    def test_01_register_creates_two_real_users(self):
        for user in (self.user_one, self.user_two):
            res = self.client.post("/api/auth/register", json=user)
            self.assertEqual(res.status_code, 200, res.text)
            data = res.json()
            self.assertTrue(data["token"], "register must return a real token")
            self.assertEqual(data["user"]["name"], user["name"])
            self.assertEqual(data["user"]["email"], user["email"].lower())
            self.assertEqual(data["user"]["role"], user["role"])
            self.assertNotIn("password_hash", data["user"])

    def test_02_me_returns_each_users_own_name_and_role(self):
        token_one = self._login(self.user_one).json()["token"]
        token_two = self._login(self.user_two).json()["token"]
        self.assertNotEqual(token_one, token_two)

        headers_one = {"Authorization": f"Bearer {token_one}"}
        headers_two = {"Authorization": f"Bearer {token_two}"}

        me_one = self.client.get("/api/auth/me", headers=headers_one)
        me_two = self.client.get("/api/auth/me", headers=headers_two)

        self.assertEqual(me_one.status_code, 200, me_one.text)
        self.assertEqual(me_two.status_code, 200, me_two.text)
        self.assertEqual(me_one.json()["user"]["name"], "Riya Verma")
        self.assertEqual(me_two.json()["user"]["name"], "Amit Nair")
        self.assertEqual(me_one.json()["user"]["role"], "student")
        self.assertEqual(me_two.json()["user"]["role"], "teacher")

    def test_03_login_as_each_user_returns_that_users_name(self):
        for user in (self.user_one, self.user_two):
            res = self._login(user)
            self.assertEqual(res.status_code, 200, res.text)
            data = res.json()
            self.assertEqual(data["user"]["name"], user["name"])
            me = self.client.get(
                "/api/auth/me",
                headers={"Authorization": f"Bearer {data['token']}"},
            )
            self.assertEqual(me.json()["user"]["name"], user["name"])

    def test_04_wrong_password_returns_401(self):
        res = self.client.post(
            "/api/auth/login",
            json={"email": self.user_one["email"], "password": "not-the-password"},
        )
        self.assertEqual(res.status_code, 401)

    def test_05_duplicate_email_returns_clear_conflict(self):
        res = self.client.post(
            "/api/auth/register",
            json={**self.user_one, "password": "Diff3rentPass"},
        )
        self.assertEqual(res.status_code, 409, res.text)
        self.assertIn("already exists", res.json()["detail"].lower())

    def test_06_weak_password_returns_422(self):
        res = self.client.post(
            "/api/auth/register",
            json={
                "name": "Weak Password",
                "email": f"weak.{uuid.uuid4().hex[:8]}@example.com",
                "password": "short",
                "role": "student",
            },
        )
        self.assertEqual(res.status_code, 422, res.text)
        self.assertIn("8 characters", res.json()["detail"])

    def test_07_missing_or_bad_token_returns_401(self):
        missing = self.client.get("/api/flashcards")
        bad = self.client.get(
            "/api/flashcards",
            headers={"Authorization": "Bearer seed_session_token_arjun"},
        )
        me_missing = self.client.get("/api/auth/me")

        self.assertEqual(missing.status_code, 401)
        self.assertEqual(bad.status_code, 401)
        self.assertEqual(me_missing.status_code, 401)


if __name__ == "__main__":
    unittest.main()
