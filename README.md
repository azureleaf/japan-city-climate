# 日本の大都市で気候が一番良いのはどこだ？

- Analyze the climate data of 7 major cities in Japan, decide which one has the best one to live in

## Usage

### Merge all the raw CSVs

1. Install Python3 & `pipenv`
1. `pipenv shell`
1. `pipenv install`
1. `python3 parse_csv.py`

### Visualization

1. `index.html`

## Data

- 都市別・月ごとの値（３０年分）を対象とする

## 気候データ種別

- 日最高気温 35℃ 以上日数(日)
- 日最高気温 30℃ 以上日数(日)
- 日最高気温 25℃ 以上日数(日)
- 日最低気温 0℃ 未満日数(日)
- 日最高気温 0℃ 未満日数(日)
- 日最低気温 25℃ 以上日数(日)
- 平均気温(℃)
- 降水量の合計(mm)
- 日照時間(時間)
- 降雪量合計(cm)

## 対象都市（東名阪札仙広福）

- 札幌
- 仙台
- 東京
- 名古屋
- 大阪
- 広島
- 福岡

## Reference

### 気象庁：過去の気象データ

- このサイトの データ選択 UI は他の官公庁サイトより遥かにすばらしかった
- https://www.data.jma.go.jp/gmd/risk/obsdl/index.php
