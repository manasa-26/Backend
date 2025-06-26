import streamlit as st
import requests
import re

# ------------------------
# Constants
# ------------------------
BACKEND_URL = "http://localhost:3000/api/docs/upload"
#VALID_USERNAME = "admin"
#VALID_PASSWORD = "admin123"

# ------------------------
# Helper: extract info
# ------------------------
def extract_info(text):
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    # Take the first line with 2 or more words
    name = next((line for line in lines if len(line.split()) >= 2), "N/A")

    email_match = re.search(r"\b[\w\.-]+@[\w\.-]+\.\w+\b", text)
    github_match = re.search(r"github\.com[/:][\w\-]+", text, re.IGNORECASE)
    linkedin_match = re.search(r"(linkedin\.com/in/[a-zA-Z0-9\-_]+)", text, re.IGNORECASE)
    edu_match = re.search(r"(B\.E\.|B\.Tech|Bachelor).+?(?=\n|$)", text, re.IGNORECASE)

    return {
        "Name": name,
        "Email": email_match.group(0) if email_match else "N/A",
        "GitHub": github_match.group(0) if github_match else "N/A",
        "LinkedIn": f"https://{linkedin_match.group(0)}" if linkedin_match else "N/A",
        "Education": edu_match.group(0) if edu_match else "N/A"
    }

# ------------------------
# Page Layout
# ------------------------
st.set_page_config(page_title="Resume Parser", layout="centered")
st.title("📄 Resume Parser with Node.js Backend")

# ------------------------
# Login
# ------------------------
if "authenticated" not in st.session_state:
    st.session_state.authenticated = False

if not st.session_state.authenticated:
    with st.form("login_form"):
        st.subheader("🔐 Login")
        username = st.text_input("Username")
        password = st.text_input("Password", type="password")
        submit = st.form_submit_button("Login")

        if submit:
            if username == VALID_USERNAME and password == VALID_PASSWORD:
                st.session_state.authenticated = True
                st.success("✅ Login successful!")
            else:
                st.error("❌ Invalid credentials")

    st.stop()

# ------------------------
# Upload Section
# ------------------------
st.subheader("📤 Upload Your Resume")
uploaded_file = st.file_uploader("Choose a .txt / .docx / .pdf file", type=["txt", "docx", "pdf"])

if uploaded_file:
    with st.spinner("Uploading and parsing..."):
        files = {"file": (uploaded_file.name, uploaded_file, uploaded_file.type)}
        try:
            res = requests.post(BACKEND_URL, files=files)
            if res.status_code == 200:
                data = res.json()
                st.success("✅ Uploaded and Parsed Successfully!")
                st.write("### 📑 Parsed Content:")
                st.code(data["content"])

                st.write("### 🎯 Extracted Info:")
                extracted = extract_info(data["content"])
                for key, value in extracted.items():
                    st.markdown(f"**{key}:** {value}")

            else:
                st.error(f"❌ Upload failed: {res.json().get('message')}")
        except Exception as e:
            st.error(f"❌ Error: {e}")
