# 🎬 CINEMovie — 영화 추천 & 커뮤니티 웹

## 프로젝트 소개

**CINEMovie**는 TMDB 영화 정보, AI 챗봇 추천, 사용자 커뮤니티를 하나의 웹에서 제공하는 SSAFY Project입니다.

**✨ CINEMovie에서 할 수 있는 것**

- 🎡 **3D 영화 캐러셀** — TMDB 현재 상영작을 입체 포스터로 탐색
- 🔍 **영화 검색·상세** — 장르, 출연, YouTube 예고편 확인
- ❤️ **프로필** — 좋아요 영화, 최애 영화, 장르 기반 추천
- 💬 **커뮤니티** — 영화와 함께 게시글 작성·공유
- 🤖 **AI Chat** — Gemini API 기반 영화 추천 챗봇

## 팀원 구성


| **박태건** | **박민제** |
| ------- | ------- |
| FE, 기획  | BE      |


- **박태건**: Vue UI/UX, API 연동, 커뮤니티·Chat, 3D 캐러셀
- **박민제**: Django 모델링, REST API, ERD

## 1. 개발 환경

- **Front** : VS Code, Node.js, Vue 3, Vite, Pinia, Vue Router
- **Back-end** : Python 3.12, Django 4.2, Django REST Framework, SQLite
- **External API** : TMDB, YouTube Data API, Google Gemini
- **협업** : GitHub, Notion
- **Repository** : [https://github.com/Ponezzo/CINEMovie](https://github.com/Ponezzo/CINEMovie)

## 2. 📦 프로젝트 구조

```
CINEMovie/
├── django/              # Django REST API
│   ├── accounts/        # User 모델
│   ├── movies/          # Post, Comment, Movie 등
│   ├── pjt/             # settings, urls
│   └── requirements.txt
├── vue/                 # Vue 3 SPA
│   ├── src/
│   │   ├── views/       # 페이지 컴포넌트
│   │   ├── stores/      # Pinia
│   │   ├── router/
│   │   └── config/
│   └── .env.example
└── README.md
```

## 3. 개발 기간 및 작업 관리

### 개발 기간

- **전체 개발 기간** : 2024.11 (SSAFY Final Project)
- **기능 구현** : 회원가입/로그인 → API 연동 → TMDB·커뮤니티·Chat
- **후속 작업** : 로컬 실행 환경 정비, 인증/CORS 수정, Gemini Chat 전환

## 4. 🔒 환경 설정

### Vue (`vue/.env`)

```powershell
cd vue
copy .env.example .env
```


| 변수                     | 설명                                  |
| ---------------------- | ----------------------------------- |
| `VITE_API_BASE_URL`    | Django 서버 (`http://127.0.0.1:8000`) |
| `VITE_TMDB_API_KEY`    | TMDB API Key                        |
| `VITE_YOUTUBE_API_KEY` | YouTube Data API Key                |
| `VITE_GEMINI_API_KEY`  | Gemini API Key                      |
| `VITE_GEMINI_MODEL`    | Gemini 모델명                          |


### 로컬 실행

**Backend (터미널 1)**

```powershell
cd django
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

**Frontend (터미널 2)**

```powershell
cd vue
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

### 포트


| 서비스    | 포트   | URL                                            |
| ------ | ---- | ---------------------------------------------- |
| Django | 8000 | [http://127.0.0.1:8000](http://127.0.0.1:8000) |
| Vue    | 5173 | [http://127.0.0.1:5173](http://127.0.0.1:5173) |


> CORS 설정 기준으로 `**127.0.0.1`로 접속** (`localhost` 사용 시 오류 가능)

## 5. 화면 미리보기

### 메인 (3D 캐러셀)

### 로그인

### 영화 검색

### 프로필

### 커뮤니티

## 6. 아키텍처 구조도

## 7. ERD

## 8. API 명세서

### Auth


| Method | Endpoint            | 설명             |
| ------ | ------------------- | -------------- |
| POST   | `/accounts/signup/` | 회원가입           |
| POST   | `/accounts/login/`  | 로그인 (Token 반환) |


### Community (Token 필요)


| Method   | Endpoint           | 설명        |
| -------- | ------------------ | --------- |
| GET/POST | `/api/posts/`      | 게시글 목록·작성 |
| GET      | `/api/posts/{id}/` | 게시글 상세    |
| DELETE   | `/api/posts/{id}/` | 게시글 삭제    |


## 9. 기술 스택

### Frontend

- **Vue 3** — Composition API, `<script setup>`
- **Vite** — 빌드 도구
- **Pinia** — 전역 상태 관리
- **Vue Router** — SPA 라우팅
- **Axios** — HTTP 클라이언트

### Backend

- **Django 4.2** — 웹 프레임워크
- **Django REST Framework** — REST API
- **dj-rest-auth** — 인증 API
- **SQLite** — 로컬 DB

### External

- **TMDB API** — 영화 메타데이터
- **YouTube Data API** — 예고편 검색
- **Google Gemini API** — AI Chat

---

