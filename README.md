# 50091

## Team Shuffle Fairness

팀 섞기 로직은 각 행(row)마다 `50%` 확률로 좌/우를 스왑합니다.
랜덤 시드 3개로 각각 `100,000회` 시뮬레이션하여 분포가 반반에 수렴하는지 검증했습니다.

| Scenario | Swapped | Stayed | Swap Ratio |
| --- | ---: | ---: | ---: |
| seed=50091 | 50,027 | 49,973 | 50.03% |
| seed=1337 | 49,829 | 50,171 | 49.83% |
| seed=20260304 | 49,781 | 50,219 | 49.78% |

- Acceptance rule: `49% ~ 51%` 범위를 통과 기준으로 사용
- Test command: `npm test`

## Audio Credits

- `Woodblock.wav` by `kwahmah_02`
  Source: https://freesound.org/s/268822/
  License: CC BY 3.0 (https://creativecommons.org/licenses/by/3.0/)

- `doyng_G_1.R.aif` by `batchku`
  Source: https://freesound.org/s/10884/
  License: CC0 (https://creativecommons.org/publicdomain/zero/1.0/)
