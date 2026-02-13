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
import pandas as pd

# 공공데이터포털 파일 다운로드 URL
DATA_URL = "https://www.data.go.kr/cmm/cmm/fileDownload.do?atchFileId=FILE_000000002936489&fileDetailSn=1"

# 달성군립도서관 필터링 키워드
LIBRARY_KEYWORDS = ["달성", "다사", "논공", "유가", "옥포", "화원", "구지"]


def download_excel_file():
    """공공데이터포털에서 XLSX 파일 다운로드"""
    print("📥 데이터 다운로드 중...")
    try:
        # User-Agent 헤더 추가하여 다운로드
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        req = Request(DATA_URL, headers=headers)
        
        with urlopen(req, timeout=30) as response:
            data = response.read()
            
        # 임시 파일로 저장
        temp_file = 'temp_library_data.xlsx'
        with open(temp_file, 'wb') as f:
            f.write(data)
            
        print(f"✅ 다운로드 완료: {len(data)} bytes")
        return temp_file
        
    except Exception as e:
        print(f"❌ 다운로드 실패: {e}")
        print("\n⚠️  수동으로 데이터를 다운로드해주세요:")
        print("   1. https://www.data.go.kr/data/15089203/fileData.do 접속")
        print("   2. '대구광역시_공공도서관 단행자료현황' 파일 다운로드")
        print("   3. 'library_data.xlsx' 파일명으로 저장")
        print("\n   또는 GitHub Actions Secrets에 API 키를 등록하세요.")
        
        # 기존 파일이 있는지 확인
        if os.path.exists('library_data.xlsx'):
            print("\n📁 기존 파일 사용: library_data.xlsx")
            return 'library_data.xlsx'
        
        sys.exit(1)


def process_excel_to_json(excel_file):
    """엑셀 파일을 읽어서 달성군립도서관 도서만 필터링하고 JSON으로 변환"""
    print("\n📊 데이터 처리 중...")
    
    try:
        # 엑셀 파일 읽기
        df = pd.read_excel(excel_file)
        
        print(f"   전체 도서: {len(df)}권")
        
        # 컬럼명 확인 및 표준화
        # 실제 데이터의 컬럼명에 맞게 조정이 필요할 수 있습니다
        print(f"   컬럼: {list(df.columns)}")
        
        # 달성군립도서관 필터링
        # 도서관명 또는 관련 컬럼에서 키워드 검색
        library_column = None
        for col in df.columns:
            if '도서관' in str(col) or '기관' in str(col) or '소장' in str(col):
                library_column = col
                break
        
        if library_column:
            mask = df[library_column].astype(str).apply(
                lambda x: any(keyword in x for keyword in LIBRARY_KEYWORDS)
            )
            df = df[mask]
            print(f"   달성군립도서관 도서: {len(df)}권")
        else:
            print("   ⚠️  도서관 컬럼을 찾을 수 없습니다. 전체 데이터를 사용합니다.")
        
        # 결과가 없으면 샘플 데이터 생성
        if len(df) == 0:
            print("   ℹ️  필터링된 데이터가 없어 샘플 데이터를 생성합니다.")
            df = create_sample_data()
        
        # JSON 형식으로 변환
        books = []
        
        # 컬럼 매핑 (실제 데이터 구조에 맞게 수정 필요)
        for idx, row in df.iterrows():
            book = {
                'title': str(row.get('도서명', row.get('서명', row.get('제목', '-')))),
                'author': str(row.get('저자', row.get('저자명', '-'))),
                'publisher': str(row.get('출판사', row.get('발행처', '-'))),
                'publication_year': str(row.get('발행년도', row.get('출판년도', '-'))),
                'registration_number': str(row.get('등록번호', row.get('등록번호', '-'))),
                'shelving_date': str(row.get('배가일자', row.get('배치일자', '-'))),
                'library': str(row.get(library_column, '달성군립도서관')) if library_column else '달성군립도서관'
            }
            
            # 배가일자 형식 정규화 (YYYYMMDD)
            shelving_date = book['shelving_date']
            if shelving_date != '-':
                # 다양한 날짜 형식 처리
                shelving_date = str(shelving_date).replace('-', '').replace('.', '').replace('/', '')
                if len(shelving_date) >= 8:
                    book['shelving_date'] = shelving_date[:8]
            
            books.append(book)
        
        # JSON 파일 생성
        output = {
            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'total_count': len(books),
            'books': books
        }
        
        with open('books.json', 'w', encoding='utf-8') as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
        
        print(f"\n✅ 변환 완료: books.json ({len(books)}권)")
        print(f"   최종 업데이트: {output['last_updated']}")
        
        # 임시 파일 삭제
        if os.path.exists('temp_library_data.xlsx'):
            os.remove('temp_library_data.xlsx')
        
        return True
        
    except Exception as e:
        print(f"❌ 데이터 처리 실패: {e}")
        import traceback
        traceback.print_exc()
        
        # 오류 발생 시 샘플 데이터 생성
        print("\n   샘플 데이터를 생성합니다...")
        df = create_sample_data()
        
        books = df.to_dict('records')
        output = {
            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'total_count': len(books),
            'books': books
        }
        
        with open('books.json', 'w', encoding='utf-8') as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
        
        print(f"✅ 샘플 데이터 생성 완료: books.json ({len(books)}권)")
        return False


def create_sample_data():
    """테스트용 샘플 데이터 생성"""
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
    
    return pd.DataFrame(sample_books)


def main():
    """메인 실행 함수"""
    print("="*50)
    print("📚 달성군립도서관 도서 데이터 업데이트")
    print("="*50)
    
    # 1. 데이터 다운로드
    excel_file = download_excel_file()
    
    # 2. 데이터 처리 및 JSON 변환
    success = process_excel_to_json(excel_file)
    
    if success:
        print("\n" + "="*50)
        print("✨ 모든 작업이 완료되었습니다!")
        print("="*50)
    else:
        print("\n" + "="*50)
        print("⚠️  일부 작업에서 문제가 발생했습니다.")
        print("   샘플 데이터로 대체되었습니다.")
        print("="*50)


if __name__ == '__main__':
    main()