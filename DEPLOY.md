# GitHub Pages 배포 가이드 📦

이 문서는 구구단 산성비 게임을 GitHub Pages에 배포하는 방법을 설명합니다.

## 🚀 배포 방법

### 방법 1: GitHub Actions 자동 배포 (권장)

이 방법은 코드를 푸시할 때마다 자동으로 배포됩니다.

#### 1단계: GitHub 저장소 생성

1. [GitHub](https://github.com)에 로그인
2. 우측 상단 `+` 버튼 클릭 → `New repository` 선택
3. Repository name: `multiplication-rain-game` (또는 원하는 이름)
4. Public 선택
5. `Create repository` 클릭

#### 2단계: 로컬 Git 초기화 및 푸시

터미널에서 프로젝트 폴더로 이동 후 실행:

```bash
# Git 초기화
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: 구구단 산성비 게임"

# GitHub 저장소 연결 (YOUR_USERNAME을 본인 GitHub 아이디로 변경)
git remote add origin https://github.com/YOUR_USERNAME/multiplication-rain-game.git

# main 브랜치로 푸시
git branch -M main
git push -u origin main
```

#### 3단계: GitHub Pages 설정

1. GitHub 저장소 페이지로 이동
2. `Settings` 탭 클릭
3. 왼쪽 메뉴에서 `Pages` 클릭
4. Source: `GitHub Actions` 선택
5. 자동으로 배포가 시작됩니다 (Actions 탭에서 진행 상황 확인 가능)

#### 4단계: 배포 완료 확인

배포가 완료되면 다음 주소에서 게임을 플레이할 수 있습니다:

```
https://YOUR_USERNAME.github.io/multiplication-rain-game/
```

---

### 방법 2: 수동 배포 (gh-pages 사용)

Node.js가 설치되어 있다면 수동으로 배포할 수 있습니다.

#### 1단계: 의존성 설치

```bash
npm install
```

#### 2단계: vite.config.ts 수정

`vite.config.ts` 파일에서 `base` 경로를 저장소 이름으로 설정:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/multiplication-rain-game/', // 저장소 이름과 일치
})
```

#### 3단계: GitHub 저장소 연결

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/multiplication-rain-game.git
git push -u origin main
```

#### 4단계: 배포 실행

```bash
npm run deploy
```

이 명령은 자동으로:
1. 프로젝트를 빌드하고
2. `gh-pages` 브랜치를 생성하고
3. GitHub Pages에 배포합니다

#### 5단계: GitHub Pages 설정

1. GitHub 저장소 → Settings → Pages
2. Source: `Deploy from a branch` 선택
3. Branch: `gh-pages` 선택, 폴더: `/ (root)` 선택
4. Save 클릭

---

## 🔧 저장소 이름이 다른 경우

저장소 이름을 `multiplication-rain-game`이 아닌 다른 이름으로 만든 경우:

1. `vite.config.ts`의 `base` 값을 수정:
   ```typescript
   base: '/YOUR_REPOSITORY_NAME/',
   ```

2. `.github/workflows/deploy.yml`은 그대로 사용 가능

---

## 🌐 커스텀 도메인 사용 (선택사항)

본인 도메인을 사용하려면:

1. 프로젝트 루트에 `public/CNAME` 파일 생성
2. 파일 내용: `yourdomain.com`
3. 도메인 DNS 설정에서 GitHub Pages IP 추가

---

## 📝 업데이트 방법

### GitHub Actions 사용 시:
```bash
git add .
git commit -m "게임 업데이트"
git push
```
푸시 후 자동으로 배포됩니다.

### 수동 배포 시:
```bash
git add .
git commit -m "게임 업데이트"
git push
npm run deploy
```

---

## ⚠️ 주의사항

1. **저장소는 Public이어야 합니다** (무료 계정의 경우)
2. **첫 배포 후 5-10분 정도 소요될 수 있습니다**
3. **브라우저 캐시 때문에 업데이트가 즉시 반영 안 될 수 있습니다** (Ctrl+F5로 강력 새로고침)

---

## 🐛 문제 해결

### "404 Not Found" 오류
- `vite.config.ts`의 `base` 경로가 저장소 이름과 일치하는지 확인
- GitHub Pages 설정에서 올바른 브랜치를 선택했는지 확인

### 배포 후 빈 화면
- 브라우저 콘솔(F12)에서 에러 확인
- `base` 경로 설정 재확인

### GitHub Actions 실패
- Actions 탭에서 에러 로그 확인
- `package.json`의 의존성 확인

---

## 📞 도움말

- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions 문서](https://docs.github.com/en/actions)

---

**만든 날짜**: 2025-11-06  
**프로젝트**: 구구단 산성비 게임  
**기술 스택**: React + TypeScript + Vite

