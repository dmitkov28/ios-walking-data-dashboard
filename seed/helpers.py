from datetime import datetime
from xml.dom.minidom import Element
from xml.etree import ElementTree as ET

import json
from datetime import datetime


def to_datetime_object(date: str, date_format: str = "%Y-%m-%dT%H:%M:%S%z") -> datetime:
    return datetime.strptime(date, date_format)


def to_string(date: datetime, format: str = "%Y-%m-%d") -> str:
    return date.strftime(format)


def is_same_date(date_1: datetime, date_2: datetime) -> bool:
    return date_1.date() == date_2.date()


def group_records_by_date(records):
    result = []
    for item in records:
        if not result:
            result.append(item)

        else:
            last_item = result[-1]
            last_item_date = to_datetime_object(last_item.get("timestamp"))
            current_item_date = to_datetime_object(item.get("timestamp"))

            if is_same_date(last_item_date, current_item_date):
                last_item["distance"] += item.get("distance")

            else:
                result.append(item)

    formatted_result = []

    for item in result:
        formatted_item = {
            "timestamp": to_string(to_datetime_object(item.get("timestamp"))),
            "distance": item.get("distance"),
        }
        formatted_result.append(formatted_item)

    with open("data.json", "w") as f:
        json.dump(formatted_result, f)


def convert_record_to_json(record):
    timestamp = datetime.strptime(
        record.get("startDate"), "%Y-%m-%d %H:%M:%S %z"
    ).isoformat()
    distance = float(record.get("value"))
    return {"timestamp": timestamp, "distance": distance}


def get_records(path: str):
    tree = ET.parse(path)
    root = tree.getroot()

    matching_elements = root.findall(
        ".//*[@type='HKQuantityTypeIdentifierDistanceWalkingRunning']"
    )

    return matching_elements


def process_records(records: list[Element]):
    data = []

    for record in records:
        converted_record = convert_record_to_json(record)
        data.append(converted_record)

    return data
