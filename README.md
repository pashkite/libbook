# 📚 LibBook - 대구 도서관 통합 조회

정보나루 API를 사용해 **대구 전체 도서관**의 도서 목록을 수집하고, 달성군 도서관을 우선 분류해서 `public/books.json`에 저장합니다.

## 변경 사항 요약

- 정보나루 수집 스크립트를 단일화했습니다: `scripts/fetch-daegu-books.js`
- 수집 순서를 **달성군 도서관 → 그 외 대구 도서관**으로 고정했습니다.
- GitHub Actions 주간(주 1회) 자동 업데이트 워크플로우를 정리했습니다.
- 중복/구식 스크립트 및 워크플로우를 제거했습니다.

## 실행 방법

```bash
npm install
JEONGBONAROU_API_KEY=발급받은키 npm run fetch:daegu-books
```

실행 결과는 `public/books.json`에 저장됩니다.

## 출력 JSON 구조

```json
{
  "updatedAt": "2026-02-19T00:00:00.000Z",
  "source": "https://www.data4library.kr",
  "region": "대구광역시",
  "libraries": {
    "dalseong": [],
    "others": [],
    "totalCount": 0
  },
  "books": [],
  "totalBookCount": 0
}
```

## 자동 업데이트(주 1회)

`.github/workflows/update-books.yml`에서 매주 월요일(KST 오전 3시) 자동 실행됩니다.

- Secrets 필요값: `JEONGBONAROU_API_KEY`
- 변경 시 `public/books.json` 자동 커밋
- 저장소 Settings → Actions에서 `Read and write permissions` 허용 필요
- 처음 1회는 Actions의 `workflow_dispatch`로 수동 실행해서 샘플 `books.json`을 실제 수집 데이터로 교체하세요.
- 워크플로우가 바로 실패하면 `JEONGBONAROU_API_KEY` 시크릿 설정 여부와 Actions 권한(읽기/쓰기), 기본 브랜치 보호 규칙을 먼저 확인하세요.

## 참고

프론트에서 `public/books.json`을 읽어 도서 목록을 표시합니다.
