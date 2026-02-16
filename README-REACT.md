# Libbook - React + Tailwind CSS 버전

첨부된 디자인을 기반으로 React + Tailwind CSS로 재구현된 도서관 시스템입니다.

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 컴포넌트 구조

- `LibraryLayout.tsx`: 전체 레이아웃 래퍼
- `Header.tsx`: 헤더 네비게이션
- `SidebarFilters.tsx`: 좌측 필터 영역
- `KDCFilterTree.tsx`: KDC 분류 아코디언 트리
- `DateRangeFilter.tsx`: 날짜 범위 필터
- `BookListContainer.tsx`: 도서 목록 컨테이너
- `BookCard.tsx`: 개별 도서 카드
- `StatusBadge.tsx`: 대출 상태 배지
- `types.ts`: TypeScript 타입 정의

## 기술 스택

- React 18
- TypeScript
- Tailwind CSS
- Vite
- lucide-react (아이콘)

## 기존 HTML 버전

기존 `index.html` 파일은 그대로 유지됩니다.
React 버전은 `index-react.html`을 사용합니다.
