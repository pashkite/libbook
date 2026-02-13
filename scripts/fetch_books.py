#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
대구광역시 공공도서관 단행자료 현황 데이터를 다운로드하고
달성군립도서관 도서만 필터링하여 JSON 파일로 변환합니다.
"""

import json
import os
import sys
from datetime import datetime
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
import pandas as pd

# 공공데이터포털 파일 다운로드 URL (여러 시도)
DATA_URLS = [
    "https://www.data.go.kr/cmm/cmm/fileDownload.do?atchFileId=FILE_000000002936489&fileDetailSn=1",
    "https://www.data.go.kr/cmm/cmm/fileDownload.do?atchFileId=FILE_000000002936489&fileDetailSn=2",
]

# 달성군립도서관 필터링 키워드
LIBRARY_KEYWORDS = ["달성", "다사", "논공", "유가", "옥포", "화원", "구지"]


def download_excel_file():
    """공공데이터포털에서 XLSX 파일 다운로드"""
    print("📥 데이터 다운로드 중...")
    
    # 기존 파일 먼저 확인
    if os.path.exists('library_data.xlsx'):
        print("📁 기존 파일 발견: library_data.xlsx")
        file_size = os.path.getsize('library_data.xlsx')
        print(f"   파일 크기: {file_size:,} bytes")
        return 'library_data.xlsx'
    
    # 여러 URL 시도
    for i, url in enumerate(DATA_URLS, 1):
        print(f"\n시도 {i}/{len(DATA_URLS)}: {url[:80]}...")
        try:
            # User-Agent 헤더 추가하여 다운로드
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, */*',
                'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
            }
            req = Request(url, headers=headers)
            
            with urlopen(req, timeout=60) as response:
                # 응답 상태 확인
                print(f"   HTTP 상태: {response.status}")
                print(f"   Content-Type: {response.headers.get('Content-Type')}")
                
                data = response.read()
                
            # 임시 파일로 저장
            temp_file = 'temp_library_data.xlsx'
            with open(temp_file, 'wb') as f:
                f.write(data)
                
            print(f"✅ 다운로드 완료: {len(data):,} bytes")
            return temp_file
            
        except HTTPError as e:
            print(f"❌ HTTP 오류: {e.code} - {e.reason}")
            continue
        except URLError as e:
            print(f"❌ URL 오류: {e.reason}")
            continue
        except Exception as e:
            print(f"❌ 다운로드 실패: {type(e).__name__}: {e}")
            continue
    
    # 모든 시도 실패
    print("\n" + "="*70)
    print("❌ 모든 다운로드 시도 실패")
    print("="*70)
    print("\n⚠️  수동으로 데이터를 다운로드해주세요:")
    print("   1. https://www.data.go.kr/data/15089203/fileData.do 접속")
    print("   2. '대구광역시_공공도서관 단행자료현황' 파일 다운로드")
    print("   3. 저장소 루트에 'library_data.xlsx' 파일명으로 저장")
    print("   4. 다시 스크립트 실행")
    print("\n   또는 샘플 데이터로 진행합니다...")
    
    return None


def process_excel_to_json(excel_file):
    """엑셀 파일을 읽어서 달성군립도서관 도서만 필터링하고 JSON으로 변환"""
    print("\n📊 데이터 처리 중...")
    
    try:
        # 엑셀 파일 읽기
        print(f"   파일 읽는 중: {excel_file}")
        df = pd.read_excel(excel_file, engine='openpyxl')
        
        print(f"   ✓ 전체 행 수: {len(df):,}")
        print(f"   ✓ 전체 컬럼 수: {len(df.columns)}")
        print("\n   📋 컬럼 목록:")
        for i, col in enumerate(df.columns, 1):
            print(f"      {i}. {col}")
        
        # 첫 몇 행 미리보기
        print("\n   📖 데이터 미리보기 (첫 3행):")
        print(df.head(3).to_string())
        
        # 달성군립도서관 필터링
        # 가능한 도서관 관련 컬럼명들
        possible_library_cols = ['도서관명', '도서관', '기관명', '기관', '소장기관', '소장처', 
                                   '배치도서관', '장서위치', '위치', '관리기관']
        
        library_column = None
        for col in df.columns:
            col_str = str(col)
            # 정확한 매치 먼저
            if col_str in possible_library_cols:
                library_column = col
                break
            # 포함 검색
            if any(keyword in col_str for keyword in ['도서관', '기관', '소장', '위치']):
                library_column = col
                break
        
        if library_column:
            print(f"\n   ✓ 도서관 컬럼 발견: '{library_column}'")
            print(f"   ✓ 고유 도서관 목록:")
            unique_libraries = df[library_column].dropna().unique()
            for lib in unique_libraries[:20]:  # 처음 20개만
                print(f"      - {lib}")
            if len(unique_libraries) > 20:
                print(f"      ... 외 {len(unique_libraries) - 20}개")
            
            # 필터링
            print(f"\n   🔍 필터링 키워드: {', '.join(LIBRARY_KEYWORDS)}")
            mask = df[library_column].astype(str).apply(
                lambda x: any(keyword in x for keyword in LIBRARY_KEYWORDS)
            )
            df_filtered = df[mask]
            print(f"   ✓ 필터링 결과: {len(df_filtered):,}권")
            
            if len(df_filtered) > 0:
                df = df_filtered
            else:
                print("   ⚠️  필터링 결과가 없습니다. 전체 데이터를 사용합니다.")
        else:
            print("\n   ⚠️  도서관 컬럼을 찾을 수 없습니다.")
            print("      사용 가능한 컬럼:")
            for col in df.columns:
                print(f"         - {col}")
            print("      전체 데이터를 사용합니다.")
        
        # 결과가 없으면 샘플 데이터 생성
        if len(df) == 0:
            print("\n   ℹ️  필터링된 데이터가 없어 샘플 데이터를 생성합니다.")
            return create_sample_json()
        
        # 컬럼 매핑 (여러 가능한 이름 시도)
        column_mapping = {
            'title': ['도서명', '서명', '제목', '책제목', '자료명'],
            'author': ['저자', '저자명', '지은이'],
            'publisher': ['출판사', '발행처', '출판'],
            'publication_year': ['발행년도', '출판년도', '출판년', '발행년'],
            'registration_number': ['등록번호', '청구기호', '자료번호'],
            'shelving_date': ['배가일자', '배치일자', '등록일자', '입수일자'],
        }
        
        def find_column(possible_names):
            """가능한 컬럼명 중 실제 존재하는 컬럼 찾기"""
            for name in possible_names:
                if name in df.columns:
                    return name
            # 부분 매치
            for name in possible_names:
                for col in df.columns:
                    if name in str(col):
                        return col
            return None
        
        print("\n   🗺️  컬럼 매핑:")
        mapped_cols = {}
        for key, possible_names in column_mapping.items():
            col = find_column(possible_names)
            if col:
                mapped_cols[key] = col
                print(f"      {key}: '{col}' ✓")
            else:
                print(f"      {key}: 없음 (기본값 사용)")
        
        # JSON 형식으로 변환
        books = []
        
        print("\n   📝 데이터 변환 중...")
        for idx, row in df.iterrows():
            try:
                book = {
                    'title': str(row.get(mapped_cols.get('title'), '-') if mapped_cols.get('title') else '-'),
                    'author': str(row.get(mapped_cols.get('author'), '-') if mapped_cols.get('author') else '-'),
                    'publisher': str(row.get(mapped_cols.get('publisher'), '-') if mapped_cols.get('publisher') else '-'),
                    'publication_year': str(row.get(mapped_cols.get('publication_year'), '-') if mapped_cols.get('publication_year') else '-'),
                    'registration_number': str(row.get(mapped_cols.get('registration_number'), '-') if mapped_cols.get('registration_number') else '-'),
                    'shelving_date': str(row.get(mapped_cols.get('shelving_date'), '-') if mapped_cols.get('shelving_date') else '-'),
                    'library': str(row.get(library_column, '달성군립도서관')) if library_column else '달성군립도서관'
                }
                
                # 배가일자 형식 정규화 (YYYYMMDD)
                shelving_date = book['shelving_date']
                if shelving_date and shelving_date != '-' and shelving_date != 'nan':
                    try:
                        # 날짜 파싱 시도
                        shelving_date = str(shelving_date).strip()
                        # 다양한 구분자 제거
                        for sep in ['-', '.', '/', ' ', '년', '월', '일']:
                            shelving_date = shelving_date.replace(sep, '')
                        # 숫자만 추출
                        shelving_date = ''.join(filter(str.isdigit, shelving_date))
                        if len(shelving_date) >= 8:
                            book['shelving_date'] = shelving_date[:8]
                    except:
                        pass
                
                # nan 값 처리
                for key in book:
                    if str(book[key]) == 'nan':
                        book[key] = '-'
                
                books.append(book)
                
            except Exception as e:
                print(f"   ⚠️  행 {idx} 처리 중 오류: {e}")
                continue
        
        if len(books) == 0:
            print("   ❌ 변환된 도서가 없습니다. 샘플 데이터를 생성합니다.")
            return create_sample_json()
        
        # JSON 파일 생성
        output = {
            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'total_count': len(books),
            'source': '대구광역시 공공데이터포털',
            'filter': '달성군립도서관',
            'books': books
        }
        
        with open('books.json', 'w', encoding='utf-8') as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
        
        print(f"\n✅ 변환 완료: books.json")
        print(f"   총 도서 수: {len(books):,}권")
        print(f"   최종 업데이트: {output['last_updated']}")
        
        # 도서 샘플 출력
        print("\n   📚 샘플 도서 (처음 3권):")
        for i, book in enumerate(books[:3], 1):
            print(f"      {i}. {book['title']} / {book['author']} / {book['publisher']}")
        
        # 임시 파일 삭제
        if os.path.exists('temp_library_data.xlsx'):
            os.remove('temp_library_data.xlsx')
        
        return True
        
    except Exception as e:
        print(f"\n❌ 데이터 처리 실패: {type(e).__name__}: {e}")
        import traceback
        print("\n상세 오류:")
        traceback.print_exc()
        
        # 오류 발생 시 샘플 데이터 생성
        print("\n   샘플 데이터를 생성합니다...")
        return create_sample_json()


def create_sample_json():
    """테스트용 샘플 JSON 데이터 직접 생성"""
    sample_books = [
        {
            'title': '달성의 역사와 문화',
            'author': '김대구',
            'publisher': '대구출판사',
            'publication_year': '2024',
            'registration_number': 'DS001234',
            'shelving_date': '20240115',
            'library': '달성군립도서관'
        },
        {
            'title': '논공읍 이야기',
            'author': '이달성',
            'publisher': '향토문화사',
            'publication_year': '2025',
            'registration_number': 'DS002345',
            'shelving_date': '20250203',
            'library': '논공도서관'
        },
        {
            'title': '다사읍의 사계',
            'author': '박다사',
            'publisher': '계절출판',
            'publication_year': '2025',
            'registration_number': 'DS003456',
            'shelving_date': '20250515',
            'library': '다사도서관'
        },
        {
            'title': '화원읍 꽃이야기',
            'author': '최화원',
            'publisher': '꽃담출판',
            'publication_year': '2026',
            'registration_number': 'DS004567',
            'shelving_date': '20260120',
            'library': '화원도서관'
        },
        {
            'title': '유가읍 전통시장',
            'author': '정유가',
            'publisher': '시장문화사',
            'publication_year': '2026',
            'registration_number': 'DS005678',
            'shelving_date': '20260210',
            'library': '유가도서관'
        }
    ]
    
    output = {
        'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'total_count': len(sample_books),
        'source': '샘플 데이터 (테스트용)',
        'filter': '달성군립도서관',
        'books': sample_books
    }
    
    with open('books.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 샘플 데이터 생성 완료: books.json ({len(sample_books)}권)")
    return False


def main():
    """메인 실행 함수"""
    print("="*70)
    print("📚 달성군립도서관 도서 데이터 업데이트")
    print("="*70)
    print(f"실행 시간: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Python 버전: {sys.version}")
    print(f"작업 디렉토리: {os.getcwd()}")
    print("="*70)
    
    # 1. 데이터 다운로드
    excel_file = download_excel_file()
    
    # 2. 데이터 처리 및 JSON 변환
    if excel_file:
        success = process_excel_to_json(excel_file)
    else:
        print("\n다운로드 실패 - 샘플 데이터 생성")
        success = create_sample_json()
    
    print("\n" + "="*70)
    if success:
        print("✨ 모든 작업이 성공적으로 완료되었습니다!")
    else:
        print("⚠️  일부 작업에서 문제가 발생했습니다.")
        print("   샘플 데이터로 대체되었습니다.")
    print("="*70)


if __name__ == '__main__':
    main()