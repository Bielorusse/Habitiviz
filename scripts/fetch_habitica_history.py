"""
Script to fetch habitica history data.
"""

import json
import datetime
import subprocess

def main():
    """
    Fetch habitica history data and store it in archive.
    """

    # read credentials
    with open("config/habitica_api_credentials.json", "r") as infile:
        credentials = json.load(infile)

    # create output file name
    output_file = "data/habitica_tasks_history_{}.csv".format(datetime.datetime.now().strftime("%Y%m%d"))

    # fetch history data from habitica
    command = [
        "curl",
        "https://habitica.com/export/history.csv",
        "-s",
        "-X",
        "GET",
        "--compressed",
        "-H",
        "x-api-user:{}".format(credentials["id"]),
        "-H",
        "x-api-key:{}".format(credentials["key"]),
        "--output",
        output_file
    ]
    subprocess.call(command)


if __name__ == "__main__":

    main()
