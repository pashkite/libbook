# 📚 달성군립도서관 도서 검색

달성군립도서관에 소장된 도서를 검색할 수 있는 웹사이트입니다.

## 🌐 접속 주소

https://pashkite.github.io/libbook

> ⚠️ **첫 접속 전 필수 설정**: GitHub Pages를 활성화해야 웹사이트가 작동합니다. 아래 "GitHub Pages 활성화" 섹션을 참고하세요.

## 🎯 GitHub Pages 활성화 (필수!)

웹사이트를 온라인에서 접속하려면 GitHub Pages를 활성화해야 합니다.

### 활성화 방법

1. **GitHub 저장소 접속**: https://github.com/pashkite/libbook
2. **Settings 탭 클릭**: 저장소 상단 메뉴에서 `Settings` 선택
3. **Pages 메뉴 선택**: 왼쪽 사이드바에서 `Pages` 클릭
4. **Source 설정**:
   - Branch: `main` 선택
   - Folder: `/ (root)` 선택
   - `Save` 버튼 클릭
5. **배포 완료 대기**: 1-2분 정도 기다리면 웹사이트가 배포됩니다
6. **접속 확인**: https://pashkite.github.io/libbook 에서 확인

### 배포 상태 확인

- `Actions` 탭에서 `pages build and deployment` 워크플로우 실행 상태를 확인할 수 있습니다.
- 녹색 체크 표시가 나타나면 배포가 완료된 것입니다.

## ✨ 주요 기능

### 🔍 검색 기능
- **도서명 검색**: 책 제목으로 검색
- **저자 검색**: 저자명으로 검색
- **출판사 검색**: 출판사명으로 검색
- **통합 검색**: 위 세 가지를 동시에 검색

### 📅 필터링
- **배가일자 필터**
  - 전체
  - 2026년
  - 2025년
  - 2024년 이후

### 📊 정렬
- 최신순 (기본)
- 오래된순
- 제목순 (가나다순)

### 📱 반응형 디자인
- 모바일, 태블릿, 데스크톱 모든 기기에서 최적화된 화면
- 직관적인 사용자 인터페이스

### 📄 페이지네이션
- 한 페이지에 20권씩 표시
- 이전/다음 페이지 이동
- 페이지 번호 직접 선택

## 🤖 자동 업데이트

GitHub Actions를 통해 매주 월요일 오전 9시(KST)에 자동으로 도서 데이터가 업데이트됩니다.

### 수동 업데이트 방법

1. GitHub 저장소 접속
2. `Actions` 탭 클릭
3. `Update Library Books Data` 워크플로우 선택
4. `Run workflow` 버튼 클릭
5. 실행 완료 후 웹사이트에서 최신 데이터 확인

## 📊 데이터 소스

- **출처**: [공공데이터포털](https://www.data.go.kr/data/15089203/fileData.do)
- **데이터셋**: 대구광역시_공공도서관 단행자료현황
- **필터**: 달성군립도서관 소장 도서만 추출

## 🛠️ 기술 스택

### Frontend
- 순수 HTML5
- CSS3 (반응형 디자인)
- Vanilla JavaScript (ES6+)

### Backend & Automation
- Python 3.11
  - pandas (데이터 처리)
  - openpyxl (엑셀 파일 읽기)
  - requests (HTTP 요청)
- GitHub Actions (자동화)
- GitHub Pages (호스팅)

### Data
- JSON 형식
- 클라이언트 사이드 렌더링

## 📁 프로젝트 구조

```
libbook/
├── index.html                  # 메인 웹 페이지
├── books.json                  # 도서 데이터 (자동 생성)
├── README.md                   # 프로젝트 설명서
├── .gitignore                  # Git 제외 파일
├── .nojekyll                   # Jekyll 비활성화
├── .github/
│   └── workflows/
│       └── update-data.yml     # GitHub Actions 워크플로우
└── scripts/
    └── fetch_books.py          # 데이터 수집 스크립트
```

## 🚀 로컬 개발

### 필요 조건
- Python 3.11 이상
- pip (Python 패키지 관리자)

### 설치 방법

1. 저장소 클론
```bash
git clone https://github.com/pashkite/libbook.git
cd libbook
```

2. Python 의존성 설치
```bash
pip install pandas openpyxl requests
```

3. 데이터 수집 스크립트 실행
```bash
python scripts/fetch_books.py
```

4. 로컬 서버 실행
```bash
python -m http.server 8000
```

5. 브라우저에서 접속
```
http://localhost:8000
```

## 📝 데이터 스크립트 사용법

### 기본 실행
```bash
python scripts/fetch_books.py
```

### 스크립트 동작
1. 공공데이터포털에서 XLSX 파일 다운로드
2. 달성군립도서관 도서만 필터링
3. JSON 형식으로 변환 (`books.json` 생성)
4. 최종 업데이트 시간 기록

### 주의사항
- 공공데이터포털 접근이 차단될 경우, 수동으로 파일을 다운로드하여 `library_data.xlsx` 파일명으로 저장하세요.
- 필터링 키워드: 달성, 다사, 논공, 유가, 옥포, 화원, 구지

## 🔧 커스터마이징

### 필터링 키워드 변경
`scripts/fetch_books.py` 파일의 `LIBRARY_KEYWORDS` 변수 수정:

```python
LIBRARY_KEYWORDS = ["달성", "다사", "논공", "유가", "옥포", "화원", "구지"]
```

### 자동 업데이트 주기 변경
`.github/workflows/update-data.yml` 파일의 `cron` 값 수정:

```yaml
schedule:
  - cron: '0 0 * * 1'  # 매주 월요일 오전 9시 (UTC 0시)
```

### 페이지당 도서 수 변경
`index.html` 파일의 `itemsPerPage` 변수 수정:

```javascript
const itemsPerPage = 20;  // 원하는 숫자로 변경
```

## 🐛 문제 해결

### GitHub Pages가 작동하지 않음
1. **Settings > Pages 확인**
   - Source가 `main` 브랜치의 `/ (root)`로 설정되어 있는지 확인
2. **Actions 탭 확인**
   - `pages build and deployment` 워크플로우가 성공적으로 실행되었는지 확인
3. **캐시 삭제**
   - 브라우저 캐시를 삭제하고 다시 시도
4. **대기 시간**
   - 첫 배포는 최대 10분 정도 소요될 수 있습니다

### books.json 파일이 없다는 오류
1. GitHub Actions가 실행되지 않았을 수 있습니다.
2. Actions 탭에서 `Update Library Books Data` 워크플로우를 수동으로 실행하세요.
3. 또는 로컬에서 `python scripts/fetch_books.py` 실행 후 커밋하세요.

### 데이터가 업데이트되지 않음
1. **GitHub Actions 로그 확인**
   - Actions 탭에서 실행 로그를 확인하세요.
2. **데이터 구조 변경**
   - 공공데이터포털의 데이터 구조가 변경되었을 수 있습니다.
   - `fetch_books.py` 스크립트의 컬럼 매핑을 확인하세요.
3. **수동 데이터 업데이트**
   - 공공데이터포털에서 수동으로 파일을 다운로드하여 `library_data.xlsx`로 저장
   - 로컬에서 스크립트 실행 후 커밋

### 웹사이트가 비어있거나 샘플 데이터만 표시됨
1. **실제 데이터 업데이트 필요**
   - 현재 샘플 데이터(5권)만 포함되어 있습니다.
   - Actions 탭에서 `Update Library Books Data`를 실행하여 실제 데이터를 다운로드하세요.
2. **공공데이터포털 접근 확인**
   - 스크립트가 공공데이터포털에 정상적으로 접근할 수 있는지 확인

## 📄 라이선스

MIT License

## 👤 개발자

- GitHub: [@pashkite](https://github.com/pashkite)

## 🙏 감사의 말

- 데이터 제공: 공공데이터포털
- 호스팅: GitHub Pages
- 자동화: GitHub Actions

## 📋 체크리스트

처음 설정할 때 다음 항목들을 확인하세요:

- [ ] GitHub Pages 활성화 (Settings > Pages에서 `main` 브랜치 선택)
- [ ] GitHub Actions 실행 (Actions 탭에서 `Update Library Books Data` 실행)
- [ ] 웹사이트 접속 확인 (https://pashkite.github.io/libbook)
- [ ] 실제 도서 데이터 확인 (샘플 데이터가 아닌 실제 달성군립도서관 도서 데이터)

---

⭐ 이 프로젝트가 도움이 되셨다면 GitHub Star를 눌러주세요!