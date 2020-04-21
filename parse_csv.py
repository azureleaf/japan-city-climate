import pandas as pd
import os


src_csv_paths = [
    os.path.join('climate-data', 'climate_sun_rain_snow.csv'),
    os.path.join('climate-data', 'climate_temp_1.csv'),
    os.path.join('climate-data', 'climate_temp_2.csv'),
    os.path.join('climate-data', 'climate_temp_3.csv'),
]

col_ja_en_maps = {
    "年月": "month",
    "日最高気温35℃以上日数(日)": "boiling_days",
    "日最高気温30℃以上日数(日)": "midsummer_days",
    "日最高気温25℃以上日数(日)": "summer_days",
    "日最低気温0℃未満日数(日)": "winter_days",
    "日最高気温0℃未満日数(日)": "midwinter_days",
    "日最低気温25℃以上日数(日)": "hot_nights",
    "平均気温(℃)": "avg_temp",
    "日最高気温の平均(℃)": "daily_high_avg_temp",
    "日最低気温の平均(℃)": "daily_low_avg_temp",
    "降水量の合計(mm)": "ppt_mm",
    "日照時間(時間)": "sunlight_hrs",
    "降雪量合計(cm)": "snowfall_cm",
}

city_ja_en_maps = {
    "札幌": "sapporo",
    "仙台": "sendai",
    "東京": "tokyo",
    "名古屋": "nagoya",
    "大阪": "osaka",
    "広島": "hiroshima",
    "福岡": "fukuoka",
}

# Columns with these keywords are unnecessary for data analysis
drop_column_keywords = ["均質番号", "現象なし情報", "品質情報"]


def csv_to_df(csv_path, has_multi_index=True):
    '''
    Convert CSV to formatted dataframe.
    Note that:
        df.iloc[0] is the raw of city names
        df.iloc[1] is the raw of data types: e.g. 年月, 降水量, 気温...
    '''

    print("Processing the CSV:", csv_path)

    df = pd.read_csv(csv_path, encoding="shift_jis", skiprows=2)

    # Drop columns with actual climate data
    cols_to_drop = []
    for col_i, field in enumerate(df.iloc[1]):
        if field in drop_column_keywords:
            cols_to_drop.append(df.columns[col_i])
    df.drop(cols_to_drop, axis='columns', inplace=True)

    # Generate the new column labels; e.g. (sendai, avg_temp)
    if has_multi_index:
        new_columns = [("month", "month")]
    elif not has_multi_index:
        new_columns = ["month"]
    for col_index, field_name in enumerate(df.iloc[0]):
        for col_ja, col_en in col_ja_en_maps.items():
            if field_name == col_ja:
                for city_ja, city_en in city_ja_en_maps.items():
                    if city_ja in df.columns[col_index]:
                        if has_multi_index:
                            new_columns.append((city_en, col_en))
                        elif not has_multi_index:
                            new_columns.append(f"{city_en}-{col_en}")
                        continue
                continue

    # Give multi-index of (city name, climate data type) for every column
    if has_multi_index:
        df.columns = pd.MultiIndex.from_tuples(new_columns)
    elif not has_multi_index:
        df.columns = new_columns

    # Drop unnecessary rows
    df.drop([0, 1], inplace=True)

    return df


def integrate_data(has_multi_index=True):
    '''Integrate all the source CSVs and return a dataframe'''

    # Create the 1st df as the base
    df = csv_to_df(src_csv_paths[0], has_multi_index)

    # Using iterator to skip the 1st CSV
    iter_csvs = iter(src_csv_paths)
    next(iter_csvs)
    for src_csv_path in iter_csvs:
        df_next = csv_to_df(src_csv_path, has_multi_index)
        if has_multi_index:
            join_on = [("month", "month")]
        elif not has_multi_index:
            join_on = "month"
        df = pd.merge(left=df,
                      right=df_next,
                      sort=False,
                      on=join_on)
    return df


def wrapper():
    # Set True when you want to use multi-index for DF
    #   ("sapporo", "avg_temp")
    #   This will be useful for following dataframe manipulation
    # Set False when you want to use single hyphenated index for DF
    #   "sapporo-avg_temp"
    #   This will be useful to use the result outside Python
    has_multi_index = False

    df = integrate_data(has_multi_index)

    df.to_csv(
        "./merged.csv",
        mode="w",
        index=False,
        header=True,
    )


if __name__ == "__main__":
    wrapper()
