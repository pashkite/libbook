# 📚 달성군립도서관 도서 검색

대구광역시 공공도서관 단행자료 현황 데이터를 활용한 달성군립도서관 도서 검색 웹사이트입니다.

## 🌐 라이브 사이트

https://pashkite.github.io/libbook/

## ✨ 기능

- 텍스트 기반 도서 검색 (도서명, 저자, 출판사)
- 배가일자별 필터링
- 다양한 정렬 옵션 (최신순, 오래된순, 제목순)
- 페이지네이션
- 반응형 디자인 (모바일 지원)
- 데이터 실시간 새로고침 기능
- 자동 데이터 업데이트 (GitHub Actions)

## 🛠️ 기술 스택

- **Frontend**: HTML, CSS, JavaScript (Vanilla JS)
- **Data Processing**: Python (pandas, openpyxl, requests)
- **Automation**: GitHub Actions
- **Hosting**: GitHub Pages
- **Data Source**: 공공데이터포털 - 대구광역시 공공도서관 단행자료현황

## 📄 데이터 소스

공공데이터포털의 "대구광역시_공공도서관 단행자료현황" 데이터를 사용합니다.
- 데이터셋 URL: https://www.data.go.kr/data/15089203/fileData.do

### ⚠️ 주요 사항

현재 저장소에는 **샘플 데이터가 포함**되어 있습니다. 실제 도서관 데이터를 사용하려면:

1. **공공데이터포털 API 키 발급 필요**: 현재 Python 스크립트는 API 키 없이 파일 다운로드를 시도하기 때문에 실패합니다.
2. **수동 데이터 업로드**: 공공데이터포털에서 XLSX 파일을 수동으로 다운로드하여 저장소의 `library_data.xlsx`로 업로드할 수 있습니다.

## 🚀 설치 및 실행

### 1. 저장소 포크

```bash
git clone https://github.com/pashkite/libbook.git
cd libbook
```

### 2. 로컬 테스트

로컬 서버로 실행:

```bash
python -m http.server 8000
```

그리고 브라우저에서 `http://localhost:8000` 접속

### 3. GitHub Pages 설정

1. GitHub 저장소의 Settings > Pages로 이동
2. Source: "Deploy from a branch" 선택
3. Branch: `main` / `/ (root)` 선택
4. Save 클릭

몇 분 후 https://[username].github.io/libbook/ 에서 확인 가능

## 🔄 데이터 업데이트

### 자동 업데이트

- **매주 월요일 오전 9시(KST)** 자동 실행
- GitHub Actions에서 자동으로 데이터 다운로드 및 업데이트

### 수동 업데이트

1. **GitHub Actions 사용**:
   - 저장소의 Actions 탭으로 이동
   - "Update Library Books Data" 워크플로우 선택
   - "Run workflow" 버튼 클릭

2. **로컬에서 실행**:

```bash
python scripts/fetch_books.py
```

### 실제 데이터 사용하기

#### 방법 1: 수동 다운로드 (권장)

1. https://www.data.go.kr/data/15089203/fileData.do 접속
2. "대구광역시_공공도서관 단행자료현황" XLSX 파일 다운로드
3. 저장소 루트에 `library_data.xlsx` 파일명으로 저장
4. `python scripts/fetch_books.py` 실행
5. 생성된 `books.json` 파일을 커밋 및 푸시

#### 방법 2: API 키 설정 (향후 개선 예정)

향후 버전에서 API 키를 사용하도록 스크립트를 개선할 예정입니다.

## 🤔 문제 해결

### 사이트에서 데이터가 표시되지 않아요

1. **books.json 파일 확인**: 저장소에 `books.json` 파일이 있는지 확인
2. **GitHub Pages 빌드 상태**: Settings > Pages에서 배포 상태 확인
3. **캐시 문제**: 브라우저 강력 새로고침 (Ctrl+Shift+R / Cmd+Shift+R)
4. **사이트의 '데이터 새로고침' 버튼 클릭**

### GitHub Actions가 실패해요

현재는 정상입니다! 공공데이터포털에서 데이터 다운로드가 실패하면:
- 스크립트는 자동으로 샘플 데이터를 생성합니다
- 실제 데이터는 위의 "실제 데이터 사용하기" 섹션 참고

### 필터링이 작동하지 않아요

- `books.json` 파일의 `library` 필드에 "달성", "다사", "논공" 등의 키워드가 포함되어 있는지 확인
- Python 스크립트의 `LIBRARY_KEYWORDS` 변수를 수정하여 재실행

## 💻 개발 가이드

### 프로젝트 구조

```
libbook/
├── index.html              # 메인 웹 페이지
├── books.json              # 도서 데이터 (JSON)
├── .nojekyll              # Jekyll 빌드 비활성화
├── scripts/
│   └── fetch_books.py     # 데이터 다운로드 및 변환 스크립트
├── .github/
│   └── workflows/
│       └── update-data.yml # GitHub Actions 워크플로우
└── README.md
```

### Python 스크립트 수정

`scripts/fetch_books.py`를 수정하여:
- 다른 도서관 필터링
- 추가 데이터 필드 처리
- 데이터 포맷 변경

### 웹 인터페이스 커스터마이징

`index.html`의 CSS 변수를 수정하여 색상 테마 변경:

```css
:root {
    --color-primary: #2563eb;        /* 메인 색상 */
    --color-primary-hover: #1d4ed8;  /* 호버 색상 */
    --color-success: #10b981;        /* 성공 메시지 색상 */
    /* ... */
}
```

## 📝 라이선스

MIT License

## 🙏 기여

기여를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 문의

문제가 있거나 개선 제안이 있으면 [Issues](https://github.com/pashkite/libbook/issues)에 등록해주세요.

---

**Made with ❤️ for 달성군립도서관**