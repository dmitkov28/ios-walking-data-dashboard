import argparse
from helpers import get_records, process_records, group_records_by_date

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--path", type=str, help="Path to xml export")
    args = parser.parse_args()
    if not args.path:
        raise Exception("Please provide a path to the xml export")

    records = get_records(path=args.path)
    processed_records = process_records(records)
    group_records_by_date(processed_records)
    print("Done.")
