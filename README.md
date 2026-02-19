# 📚 LibBook - 달성군 도서관 통합 검색 시스템

정보나루 API를 활용한 달성군 도서관 통합 검색 및 조회 서비스입니다.

## ✨ 주요 기능

### 🏢 도서관 복수 선택
- 달성군립도서관, 다사도서관, 논공도서관 등 7개 도서관
- 체크박스로 여러 도서관 동시 선택 가능
- "전체 선택" 버튼으로 한 번에 선택/해제

### 📖 자료실 필터
- 일반자료실, 어린이자료실, 참고자료실 등
- 복수 선택으로 원하는 자료실만 조회

### 📊 실시간 API 연동
- **신착도서**: 도서관별 최신 소장 도서 실시간 조회
- **인기도서**: 최근 1개월 대출 빈도 기준 인기 도서
- **도서 검색**: 정보나루 API를 통한 통합 검색

### 🔍 검색 및 정렬
- 제목/저자명 키워드 검색
- 최신순, 오래된순, 제목순 정렬
- 페이지네이션 지원

## 🚀 설치 및 실행

### 1. 환경 설정

```bash
# 저장소 클론
git clone https://github.com/pashkite/libbook.git
cd libbook

# 의존성 설치
npm install

# .env 파일 생성
cp .env.example .env
```

### 2. API 키 설정

`.env` 파일에 정보나루 API 키를 추가하세요:

```env
VITE_JEONGBONAROU_API_KEY=your_api_key_here
```

**API 키 발급 방법:**
1. [공공데이터포털](https://www.data.go.kr/) 회원가입
2. "도서관 정보나루" 검색
3. 활용신청 후 승인
4. 발급받은 인증키를 `.env`에 입력

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 4. 프로덕션 빌드

```bash
npm run build
npm run preview
```

## 📦 기술 스택

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: 정보나루 (도서관 정보나루) 공공 API
- **Deployment**: GitHub Pages

## 🏗️ 프로젝트 구조

```
libbook/
├── src/
│   ├── components/
│   │   ├── App.tsx                   # 메인 앱
│   │   ├── Header.tsx                # 상단 헤더 & 탭
│   │   ├── SidebarFilters.tsx        # 사이드바 필터
│   │   ├── MultiLibraryFilter.tsx    # 도서관 복수 선택
│   │   ├── RoomFilter.tsx            # 자료실 필터
│   │   ├── BookListContainer.tsx     # 도서 목록 컨테이너
│   │   ├── BookCard.tsx              # 도서 카드
│   │   ├── KDCFilterTree.tsx         # KDC 분류 트리
│   │   └── DateRangeFilter.tsx       # 날짜 범위 필터
│   ├── services/
│   │   └── api.ts                    # 정보나루 API 서비스
│   ├── main.tsx
│   └── vite-env.d.ts                 # Vite 타입 정의
├── public/
│   └── books.json                    # 폴백용 샘플 데이터
├── .env.example                      # 환경변수 예시
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 🔧 환경 변수

| 변수명 | 설명 | 필수 여부 |
|--------|------|----------|
| `VITE_JEONGBONAROU_API_KEY` | 정보나루 API 인증키 | ✅ 필수 |

## 🚀 배포

GitHub Pages를 통해 자동 배포됩니다.

1. **GitHub Secrets 설정**
   - Repository Settings → Secrets → Actions
   - `VITE_JEONGBONAROU_API_KEY` 추가

2. **자동 배포**
   - `main` 브랜치에 push 시 자동 배포
   - GitHub Actions 워크플로우가 자동 실행
   - 빌드 완료 후 `gh-pages` 브랜치에 배포

3. **접속 URL**
   - https://pashkite.github.io/libbook

## 📝 API 사용법

### 신착도서 조회
```typescript
import { getNewBooks } from './services/api';

const books = await getNewBooks('LIB140001', 'adult', 1, 20);
```

### 인기도서 조회
```typescript
import { getPopularBooks } from './services/api';

const popularBooks = await getPopularBooks(
  'LIB140001',
  '2026-01-01',
  '2026-02-01',
  1,
  20
);
```

### 도서 검색
```typescript
import { searchBooks } from './services/api';

const searchResults = await searchBooks('파친코', 1, 20);
```

## 🎯 개발 로드맵

- [x] 도서관 복수 선택 기능
- [x] 정보나루 API 연동
- [x] 신착도서 실시간 조회
- [x] 인기도서 실시간 조회
- [ ] 도서관별 소장 정보 조회
- [ ] 대출 가능 여부 실시간 확인
- [ ] KDC 분류별 필터링
- [ ] 날짜 범위 필터 구현
- [ ] 도서 상세 정보 모달
- [ ] 북마크 기능

## 📄 라이선스

MIT License

## 🤝 기여

Pull Request를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 문의

프로젝트에 대한 문의사항이나 버그 리포트는 [Issues](https://github.com/pashkite/libbook/issues)에 등록해주세요.

---

**Made with ❤️ for 달성군 도서관 이용자**
