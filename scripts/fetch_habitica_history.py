"""
Script to fetch habitica history data of the current week.
"""

import os
import json
import datetime
import subprocess


def main():
    """
    Fetch habitica history data of the current week and store it in archive.
    """

    # read config
    habitiviz_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
    with open(os.path.join(habitiviz_path, "config", "config.json"), "r") as infile:
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

    # copy only data from the current week in a tmp file
    tmp_file = "{}_tmp.csv".format(os.path.splitext(output_file)[0])
    with open(output_file, "r") as infile:
        with open(tmp_file, "w") as outfile:
            for row in [r for r in infile if not r == "" and not r.startswith("Task Name")]:

                date_str = row.split(",")[3][:10] # parse date from history file
                date_obj = datetime.datetime.strptime(date_str, "%Y-%m-%d") # convert in date obj
                if date_obj.isocalendar()[1] == datetime.datetime.now().isocalendar()[1]:
                    # if the item is within the current week, copy it in the tmp file
                    outfile.write(row)

    # replace the archive file with the tmp file
    os.remove(output_file)
    os.rename(tmp_file, output_file)

if __name__ == "__main__":

    main()
