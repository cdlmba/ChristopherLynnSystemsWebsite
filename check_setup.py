"""
Pre-flight Check Script
Run this before starting the server to verify everything is configured correctly.
"""

import os
import sys

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    if version.major >= 3 and version.minor >= 7:
        print("✓ Python version OK:", f"{version.major}.{version.minor}.{version.micro}")
        return True
    else:
        print("✗ Python version too old. Need 3.7+, have:", f"{version.major}.{version.minor}.{version.micro}")
        return False

def check_dependencies():
    """Check if required packages are installed"""
    required = ['flask', 'stripe', 'flask_cors']
    missing = []
    
    for package in required:
        try:
            __import__(package)
            print(f"✓ {package} installed")
        except ImportError:
            print(f"✗ {package} NOT installed")
            missing.append(package)
    
    if missing:
        print("\nTo install missing packages, run:")
        print("pip install -r requirements.txt")
        return False
    return True

def check_env_file():
    """Check if .env file exists and has required variables"""
    if not os.path.exists('.env'):
        print("✗ .env file NOT found")
        print("\nCreate .env file by copying .env.example:")
        print("copy .env.example .env")
        print("\nThen edit .env and add your Stripe keys")
        return False
    
    print("✓ .env file exists")
    
    # Check if it has the required variables
    required_vars = [
        'STRIPE_SECRET_KEY',
        'STRIPE_PUBLISHABLE_KEY',
        'STRIPE_PRICE_ID',
        'FLASK_SECRET_KEY'
    ]
    
    with open('.env', 'r') as f:
        content = f.read()
    
    missing_vars = []
    for var in required_vars:
        if var not in content or f"{var}=your_" in content or f"{var}=" not in content:
            missing_vars.append(var)
            print(f"  ⚠ {var} needs to be configured")
        else:
            print(f"  ✓ {var} is set")
    
    if missing_vars:
        print("\n⚠ Some environment variables need configuration")
        print("Edit .env file and add your actual Stripe keys")
        return False
    
    return True

def check_pdf_folder():
    """Check if PDF folder exists"""
    pdf_folder = os.path.join('Resources', 'protected_pdfs')
    
    if not os.path.exists(pdf_folder):
        print(f"✗ PDF folder NOT found: {pdf_folder}")
        return False
    
    print(f"✓ PDF folder exists: {pdf_folder}")
    
    # Check if there are any PDFs
    pdf_files = [f for f in os.listdir(pdf_folder) if f.endswith('.pdf')]
    
    if pdf_files:
        print(f"  ✓ Found {len(pdf_files)} PDF file(s):")
        for pdf in pdf_files:
            print(f"    - {pdf}")
    else:
        print("  ⚠ No PDF files found")
        print("  Add your PDF files to:", pdf_folder)
    
    return True

def check_templates():
    """Check if all template files exist"""
    required_templates = [
        'buy_button.html',
        'success.html',
        'access.html',
        'login.html',
        'cancel.html',
        'expired.html'
    ]
    
    templates_folder = 'templates'
    
    if not os.path.exists(templates_folder):
        print(f"✗ Templates folder NOT found: {templates_folder}")
        return False
    
    print(f"✓ Templates folder exists")
    
    missing = []
    for template in required_templates:
        template_path = os.path.join(templates_folder, template)
        if os.path.exists(template_path):
            print(f"  ✓ {template}")
        else:
            print(f"  ✗ {template} NOT found")
            missing.append(template)
    
    if missing:
        print("\n✗ Some template files are missing")
        return False
    
    return True

def main():
    """Run all checks"""
    print("=" * 60)
    print("STRIPE PAYMENT INTEGRATION - PRE-FLIGHT CHECK")
    print("=" * 60)
    print()
    
    checks = [
        ("Python Version", check_python_version),
        ("Dependencies", check_dependencies),
        ("Environment File", check_env_file),
        ("PDF Folder", check_pdf_folder),
        ("Templates", check_templates),
    ]
    
    results = []
    
    for name, check_func in checks:
        print(f"\n{name}:")
        print("-" * 40)
        result = check_func()
        results.append(result)
        print()
    
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    
    if all(results):
        print("✓ ALL CHECKS PASSED!")
        print("\nYou're ready to start the server:")
        print("python stripe_server.py")
        print("\nThen visit: http://localhost:5000")
    else:
        print("✗ SOME CHECKS FAILED")
        print("\nPlease fix the issues above before starting the server.")
        print("\nQuick fixes:")
        print("1. Install dependencies: pip install -r requirements.txt")
        print("2. Create .env file: copy .env.example .env")
        print("3. Edit .env and add your Stripe keys")
        print("4. Add PDF files to Resources/protected_pdfs/")
    
    print()
    print("=" * 60)

if __name__ == '__main__':
    main()
