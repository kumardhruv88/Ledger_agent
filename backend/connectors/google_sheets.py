"""
Google Sheets & Google Drive Connector
=======================================
Allows users to connect directly to Google Sheets or Drive CSVs
instead of uploading a local file.

Authentication: Google OAuth2 (service account or user OAuth)
Libraries: google-api-python-client, gspread

Supported inputs:
- Google Sheets URL (any sheet in the workbook)
- Google Drive file URL (CSV/Excel files)
- Sheet ID + tab name

Returns: pandas DataFrame (same interface as file upload)
"""
import io
import logging
import re
from typing import Optional, Tuple

import pandas as pd

logger = logging.getLogger(__name__)

# ─── URL Parsing ──────────────────────────────────────────────────────────────

def extract_sheet_id(url: str) -> Optional[str]:
    """
    Extract Google Sheets ID from various URL formats.
    
    Supports:
    - https://docs.google.com/spreadsheets/d/SHEET_ID/edit
    - https://docs.google.com/spreadsheets/d/SHEET_ID/gviz/tq
    """
    pattern = r'/spreadsheets/d/([a-zA-Z0-9-_]+)'
    match = re.search(pattern, url)
    return match.group(1) if match else None


def extract_drive_file_id(url: str) -> Optional[str]:
    """Extract Google Drive file ID from share URL."""
    patterns = [
        r'/file/d/([a-zA-Z0-9-_]+)',
        r'id=([a-zA-Z0-9-_]+)',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


# ─── Public Sheet Access (No Auth Required) ───────────────────────────────────

def fetch_public_google_sheet(
    url: str,
    sheet_name: Optional[str] = None,
) -> Tuple[pd.DataFrame, str]:
    """
    Fetch a publicly shared Google Sheet as a DataFrame.
    The sheet must be shared with "Anyone with link can view".
    
    Uses the CSV export URL — no API key required for public sheets.
    
    Returns: (DataFrame, inferred_filename)
    """
    import urllib.request

    sheet_id = extract_sheet_id(url)
    if not sheet_id:
        raise ValueError(f"Could not extract sheet ID from URL: {url}")

    # Build the CSV export URL
    # If sheet_name provided, we'd need gid — for simplicity, export first tab
    csv_export_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv"
    if sheet_name:
        # Append gid if known (would need to resolve tab name → gid)
        logger.info(f"[GoogleSheets] Fetching sheet: {sheet_id}")

    try:
        with urllib.request.urlopen(csv_export_url, timeout=30) as response:
            content = response.read()
        df = pd.read_csv(io.BytesIO(content))
        filename = f"google_sheet_{sheet_id[:8]}.csv"
        logger.info(f"[GoogleSheets] Fetched {df.shape} from sheet {sheet_id}")
        return df, filename
    except Exception as e:
        raise RuntimeError(f"Failed to fetch Google Sheet: {e}. Ensure the sheet is publicly shared.")


def fetch_public_drive_csv(url: str) -> Tuple[pd.DataFrame, str]:
    """
    Fetch a publicly shared CSV/Excel file from Google Drive.
    Uses the direct download URL format.
    
    Returns: (DataFrame, inferred_filename)
    """
    import urllib.request

    file_id = extract_drive_file_id(url)
    if not file_id:
        raise ValueError(f"Could not extract file ID from Drive URL: {url}")

    download_url = f"https://drive.google.com/uc?export=download&id={file_id}"

    try:
        with urllib.request.urlopen(download_url, timeout=30) as response:
            content = response.read()
            content_type = response.headers.get('Content-Type', '')

        if 'excel' in content_type or 'spreadsheet' in content_type:
            df = pd.read_excel(io.BytesIO(content))
            filename = f"drive_file_{file_id[:8]}.xlsx"
        else:
            df = pd.read_csv(io.BytesIO(content))
            filename = f"drive_file_{file_id[:8]}.csv"

        logger.info(f"[GoogleDrive] Fetched {df.shape} from {file_id}")
        return df, filename
    except Exception as e:
        raise RuntimeError(f"Failed to fetch Drive file: {e}. Ensure the file is publicly shared.")


# ─── Authenticated Access (Service Account) ───────────────────────────────────

def fetch_sheet_with_service_account(
    sheet_id: str,
    credentials_json: dict,
    worksheet_name: Optional[str] = None,
) -> Tuple[pd.DataFrame, str]:
    """
    Fetch a Google Sheet using a service account (for private sheets).
    
    Args:
        sheet_id: The Google Sheets document ID
        credentials_json: Service account credentials dict
        worksheet_name: Tab name (default: first sheet)
    
    Returns: (DataFrame, filename)
    """
    try:
        import gspread
        from google.oauth2.service_account import Credentials

        scopes = [
            'https://www.googleapis.com/auth/spreadsheets.readonly',
            'https://www.googleapis.com/auth/drive.readonly',
        ]
        creds = Credentials.from_service_account_info(credentials_json, scopes=scopes)
        client = gspread.authorize(creds)
        spreadsheet = client.open_by_key(sheet_id)

        if worksheet_name:
            worksheet = spreadsheet.worksheet(worksheet_name)
        else:
            worksheet = spreadsheet.sheet1

        data = worksheet.get_all_records()
        df = pd.DataFrame(data)
        filename = f"{spreadsheet.title}_{worksheet.title}.csv"
        logger.info(f"[GoogleSheets] Fetched private sheet: {filename}, shape={df.shape}")
        return df, filename

    except ImportError:
        raise RuntimeError("Install gspread: pip install gspread google-auth")
    except Exception as e:
        raise RuntimeError(f"Service account auth failed: {e}")


# ─── Smart URL Router ─────────────────────────────────────────────────────────

def fetch_from_url(url: str) -> Tuple[bytes, str]:
    """
    Smart router: detects URL type and returns (file_bytes, filename).
    Same interface as direct file upload — plugs into A0 Janitor.
    """
    url = url.strip()

    if 'docs.google.com/spreadsheets' in url:
        df, filename = fetch_public_google_sheet(url)
    elif 'drive.google.com' in url:
        df, filename = fetch_public_drive_csv(url)
    else:
        raise ValueError(f"Unsupported URL format: {url}. Supported: Google Sheets, Google Drive.")

    # Convert DataFrame back to CSV bytes (same as file upload interface)
    csv_bytes = df.to_csv(index=False).encode('utf-8')
    return csv_bytes, filename
