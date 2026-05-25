def process_file(filename):
    """Process a text file by converting each line to uppercase."""
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            for line in file:
                print(line.strip().upper())
    except FileNotFoundError:
        print(f'Error: File {filename} not found', file=sys.stderr)
    except PermissionError:
        print(f'Error: Permission denied for {filename}', file=sys.stderr)
    except Exception as e:
        print(f'Unexpected error: {str(e)}', file=sys.stderr)