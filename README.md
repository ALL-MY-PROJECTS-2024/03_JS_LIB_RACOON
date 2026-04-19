# Raccoon 3D (JS / Three.js)

브라우저에서 동작하는 **서드퍼슨 3D 액션** 데모입니다. Three.js로 씬을 구성하고, FBX로 너구리 캐릭터를 불러와 이동·애니메이션·장애물·동전 수집까지 플레이할 수 있습니다.

---

## 기술 스택

| 구분 | 사용 |
|------|------|
| **렌더링 / 3D** | [Three.js](https://threejs.org/) (`three.min.js`) |
| **모델** | FBX (`FBXLoader.js`), 압축 해제용 `fflate.min.js` |
| **카메라** | `OrbitControls.js` (마우스 궤도), 인게임은 플레이어 추적 카메라 |
| **빌드 도구** | 없음 — 순수 HTML / JS, 로컬 정적 서버로 실행 |
| **에디터 / 디버그** | VS Code — `.vscode/launch.json`에서 Chrome을 `http://localhost:8080`으로 연결 (아래 Python 서버와 포트 맞춤) |

---

## 주요 기능

- **캐릭터**: FBX 애니메이션 (Idle, Walk, Run, BackWard, Jump 등)
- **입력**: WASD, **가상 조이스틱**(좌하단), 키보드와 스틱 UI 연동
- **장애물**: 고정 큐브, **이동형 장애물**(몬스터 박스), 스폰 시 겹침 방지·이동 중 정적 장애물과 분리
- **HP**: 머리 위 HP 바, **옆면 충돌 시** 데미지 / **윗면 착지·이동 시** 데미지 없음
- **점프·플랫폼**: 스페이스 점프, 장애물 **위에 착지·이동**, 달리기 중 점프 시 속도·착지 후 Run 유지 등
- **부스트**: 버튼·**B키**, 지속 시간 동안 가속 + 잔상 이펙트
- **동전**: 장애물 위 동전 수집, 우측 상단 **획득 / 총** 표시
- **게임 오버**: HP 0 시 화면 + **다시 하기**(상태·몬스터·동전 초기화)
- **UI 테마**: 캔버스·UI **흑백(그레이스케일)** 톤

---

## 프로젝트 구조

```
03_JS_LIB_RACOON/
├── index.html              # 진입점, 스크립트 로드·기본 UI(애니 선택 등)
├── assets/
│   ├── Raccoon_add_jump.fbx   # 플레이어 메시·애니 (`game_05.js`에서 로드)
│   ├── RaccoonAction.fbx      # 애니 클립 병합용 (`game_05.js`에서 로드)
│   ├── Raccoon.fbx            # 초기 실습용 (`game_01.js` 등에서 로드)
│   └── Palette01.png          # 에셋에 포함 (필요 시 모델·머티리얼과 연동)
├── lib/
│   ├── three.min.js
│   ├── fflate.min.js
│   ├── FBXLoader.js
│   └── OrbitControls.js
├── js/
│   ├── game_05.js          # 메인 게임 로직 (Game 클래스) — index.html이 로드
│   ├── game_01.js … game_04.js  # 단계별/이전 실습 스크립트 (현재 진입점 미사용)
│   └── GamePad.js          # 가상 조이스틱·키보드 입력
├── .vscode/
│   └── launch.json         # Chrome 디버그용 (localhost:8080)
└── README.md
```

> `index.html`은 `GamePad.js` 다음에 **`game_05.js`만** 로드합니다. `game_01`~`game_04`는 참고·실습용으로 남아 있습니다.

---

## 실행 방법

1. **로컬 웹 서버**로 루트를 띄웁니다. (파일을 `file://`로 직접 열면 FBX 로드 등에서 CORS 제한이 날 수 있습니다.)

   **예 — Python 3**

   ```bash
   cd 프로젝트_루트
   python -m http.server 8080
   ```

   브라우저에서 `http://localhost:8080` 접속.

2. **VS Code**: Live Server 등으로 같은 루트를 서빙해도 됩니다. (F5로 Chrome을 띄울 때는 `launch.json`과 서버 **포트가 같아야** 합니다.)

---

## 조작

| 입력 | 동작 |
|------|------|
| **W A S D** | 이동 / 회전 |
| **Space** | 전진 중 점프 |
| **B** | 부스트 |
| **좌하단 조이스틱** | 터치·마우스로 동일 이동 (WASD와 시각 동기화) |
| **상단 셀렉트** | 애니메이션 강제 전환 (디버그/테스트용) |
| **우하단 BOOST** | 부스트 버튼 |

---

## 에셋·경로

- 게임 실행에 쓰이는 FBX는 `game_05.js`에서 `./assets/Raccoon_add_jump.fbx`, `./assets/RaccoonAction.fbx`로 로드됩니다.  
- 경로·파일명이 위와 다르면 로더 오류가 나므로 `assets` 내용을 맞춰 두세요. `game_01`~`game_04`를 켜보려면 해당 스크립트가 기대하는 FBX 이름도 필요합니다.

---

## 브라우저

- WebGL 지원 최신 브라우저 권장.  
- 모바일은 터치 조이스틱 동작을 전제로 합니다.

---

## 라이선스

- Three.js 및 포함된 예제 로더는 각각 원 라이선스를 따릅니다.  
- FBX 캐릭터·본 프로젝트 코드의 라이선스는 저장소 정책에 맞게 별도 명시하는 것을 권장합니다.
