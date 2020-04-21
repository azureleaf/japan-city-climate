import pandas as pd
import os


src_csv_paths = [
    os.path.join('climate-data', 'climate_sun_rain_snow.csv'),
    os.path.join('climate-data', 'climate_temp_1.csv'),
    os.path.join('climate-data', 'climate_temp_2.csv'),
    os.path.join('climate-data', 'climate_temp_3.csv'),
    os.path.join('climate-data', 'climate_temp_4.csv'),
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

drop_column_keywords = ["均質番号", "現象なし情報", "品質情報"]


def csv_to_df(csv_path):
    '''
    Convert CSV to formatted dataframe.
    Note that:
        df.iloc[0] is the raw of city names
        df.iloc[1] is the raw of data types: e.g. 年月, 降水量, 気温...
    '''
    df = pd.read_csv(csv_path, encoding="shift_jis", skiprows=2)

    # Drop columns with no climate data
    cols_to_drop = []
    for col_i, field in enumerate(df.iloc[1]):
        if field in drop_column_keywords:
            cols_to_drop.append(df.columns[col_i])
    df.drop(cols_to_drop, axis='columns', inplace=True)

    # Generate the new column labels; e.g. (sendai, avg_temp)
    new_columns = [("month", "month")]
    for col_index, field_name in enumerate(df.iloc[0]):
        for col_ja, col_en in col_ja_en_maps.items():
            if field_name == col_ja:
                for city_ja, city_en in city_ja_en_maps.items():
                    if city_ja in df.columns[col_index]:
                        new_columns.append((city_en, col_en))
                        continue
            continue

    # Give multi-index of (city name, climate data type) for every column
    df.columns = pd.MultiIndex.from_tuples(new_columns)

    # Drop unnecessary rows
    df.drop([0, 1], inplace=True)

    return df


def integrate_data():
    '''Integrate all the source CSVs and return a dataframe'''

    # Create the 1st df as the base
    df = csv_to_df(src_csv_paths[0])

    # Using iterator to skip the 1st CSV
    iter_csvs = iter(src_csv_paths)
    next(iter_csvs)
    for src_csv_path in iter_csvs:
        df_next = csv_to_df(src_csv_path)
        df = pd.merge(left=df,
                      right=df_next,
                      sort=False,
                      on=[("month", "month")])
    return df


df = integrate_data()
df.to_csv(
    "./merged.csv",
    mode="w",
    index=False,
    header=True)
