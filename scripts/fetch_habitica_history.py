"""
Script to fetch habitica history data.
"""

import os
import json
import datetime
import subprocess


def main():
    """
    Fetch habitica history data and store it in archive.
    """

    # read config
    with open("config/config.json", "r") as infile:
        config = json.load(infile)

    # create output file name
    output_file = os.path.join(
        config["archive_dir"],
        "habitica_tasks_history_{}.csv".format(
            datetime.datetime.now().strftime("%Y%m%d")
        ),
    )

    # fetch history data from habitica
    command = [
        "curl",
        "https://habitica.com/export/history.csv",
        "-s",
        "-X",
        "GET",
        "--compressed",
        "-H",
        "x-api-user:{}".format(config["id"]),
        "-H",
        "x-api-key:{}".format(config["key"]),
        "--output",
        output_file,
    ]
    subprocess.call(command)


if __name__ == "__main__":

    main()
