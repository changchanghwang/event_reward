# event_reward

이벤트/보상 관리 플랫폼입니다.

## 목차

- [실행](#실행)
  - [service 설명](#service-설명)
- [기술스택](#기술스택)
- [신경 쓴 부분](#신경-쓴-부분)
  - [어려웠던 부분](#어려웠던-부분)
  - [조건 검증 방식](#조건-검증-방식)
- [Workflow](#workflow)
  - [Guard](#guard)
    - [Auth Guard](#auth-guard)
    - [Role Guard](#role-guard)
  - [User Context](#user-context)
    - [User 등록 (public)](#user-등록-public)
    - [로그인 (public)](#로그인-public)
    - [user role 변경 (private)](#user-role-변경-private)
  - [Event Context](#event-context)
    - [event 등록 (private)](#event-등록-private)
    - [이벤트 조회 (private)](#이벤트-조회-private)
    - [이벤트 시작 - 수동 (private)](#이벤트-시작---수동-private)
    - [이벤트 시작 - 자동](#이벤트-시작---자동)
  - [Reward Context](#reward-context)
    - [보상 등록 (private)](#보상-등록-private)
    - [보상 조회 (private)](#보상-조회-private)
  - [Reward-Request Context](#reward-request-context)
    - [보상 요청 등록 (private)](#보상-요청-등록-private)
    - [보상 요청 조회 (private)](#보상-요청-조회-private)
    - [보상 요청 승인 (private)](#보상-요청-승인-private)
    - [보상 요청 거절 (private)](#보상-요청-거절-private)
  - [Activity Context](#activity-context)
    - [출석 이벤트 참여 활동 기록](#출석-이벤트-참여-활동-기록)

## 실행

```bash
docker compose up [실행 할 service 이름(전부 실행할 것이라면 입력하지 않아도 된다.)]
```

### service 설명

- auth-db: MongoDB auth server 전용 데이터베이스 (27017 포트)
- event-db: MongoDB event server 전용 데이터베이스 (27018 포트)
- auth-server: 인증 서버 (4040 포트)
- event-server: 이벤트 서버 (4041 포트)
- gateway-server: API 게이트웨이 (4042 포트)
- kafka: 메시지 브로커 (9092 포트)
- kafka-init: Kafka 토픽 초기화
- kafka-ui: Kafka 관리 UI (28989 포트)

## 기술스택

| 항목      | 버전/도구               |
| --------- | ----------------------- |
| Node.js   | 18 (고정)               |
| NestJS    | 최신                    |
| DB        | MongoDB                 |
| 인증      | JWT                     |
| 배포/실행 | Docker + docker-compose |
| 언어      | TypeScript              |
| 이벤트    | Kafka                   |

## 신경 쓴 부분

전체적으로 개발 생산성에 초점을 맞춰서 개발했습니다.

- 로컬에서 처음 시작할 때 docker compose 명령어 하나만으로 실행 할 수 있도록 했습니다.
- 폴더구조에서 어그리거트 별로 수직분할 후 다시 레이어별로 수평분할 하여 도메인별로 작업하기 쉽도록 했습니다.
- 최대한 흐름이 자연스럽게 하여 도메인 flow대로 실행될 수 있도록 했습니다.
- 확장성 있는 설계구조를 가져가보고자 했습니다.
- Domain Driven Design을 적용하여 설계단부터 도메인을 나누고 개발생산성을 올리도록 했습니다.

### 어려웠던 부분

MSA를 처음 설계해 봐서 서로 의존성을 최대한 없게 가져가 single point failure를 없앨 수 있도록 하는것이 어려웠던 것 같습니다.
그래서 gateway server에서 라우팅을 하고 auth-server와 event-server는 서로 호출하지 않도록 하여 결합도를 최대한 낮춰보려고 했습니다. (kafka event 사용)

### 조건 검증 방식

조건 검증 방식은 테스트코드와 postman을 이용한 호출이었습니다.

## Workflow

### Guard

#### Auth Guard

```mermaid
flowchart LR
    A[요청] --> B{Bearer 토큰인가?}
    B -->|No| C[에러]
    B -->|Yes| D{Access Token verify}
    D -->|Error| C
    D -->|Pass| E{access token의 id가 db에 있는 유저인가?}
    E -->|No| C
    E -->|Yes| F[req.state에 user정보 담음]
    F --> G[종료]
```

#### Role Guard

```mermaid
flowchart LR
    A[요청] --> B{메타데이터에 roles가 있는가?}
    B -->|No| C[Pass]
    B -->|Yes| D{req.state.user에 roles가 있는가?}
    D -->|No| E[에러]
    D -->|Yes| F{메타데이터의 roles가 user의 roles에 포함되는가?}
    F -->|No| E
    F -->|Yes| C
```

### User Context

#### User 등록 (public)

```mermaid
flowchart LR
A[요청] --> B[유저 인스터늣 생성]
B--> C{username이 중복되는가?}
C -->|Yes| AA[에러]
C -->|No| D{email이 중복되는가?}
D -->|Yes| AA
D --> E[종료]
```

#### 로그인 (public)

```mermaid
flowchart LR
A[요청] --> B{email에 해당하는 user가 있는가?}
B -->|No| AA[에러]
B -->|Yes| C{password가 일치하는가?}
C -->|No| AA
D -->|Yes| E[lastLoggedInAt 기록, accessToken 발행]
E --> F[UserLoggedInEvent 발행]
F --> G[accessToken 반환]
G --> H[종료]
```

#### user role 변경 (private)

```mermaid
flowchart LR
A[요청] --> B{ADMIN 인가?}
B -->|No| AA[에러]
B -->|Yes| C{User가 존재하는가?}
C -->|No| AA
C -->|Yes| D[유저 role 변경]
D --> 종료
```

### Event context

#### event 등록 (private)

```mermaid
flowchart LR
A[요청] --> B{OPERATOR or ADMIN 인가?}
B -->|No| AA[error]
B -->|Yes| C[이벤트 등록]
C --> 종료
```

#### 이벤트 조회 (private)

```mermaid
flowchart LR
A[요청] --> B[모든 이벤트 조회 w. pagination]
B --> 종료
```

#### 이벤트 시작 - 수동 (private)

```mermaid
flowchart LR
A[요청] --> B{OPERATOR or ADMIN 인가?}
B -->|No| AA[error]
B -->|Yes| C{id에 해당하는 event가 있는가?}
C -->|No| AA
C -->|Yes| D{event가 SCHEDULED 상태인가?}
D -->|No| AA
D -->|Yes| E[진행중으로 상태 변경, event startAt이 없으면 기록, 상태변경시간 기록]
E --> 종료
```

#### 이벤트 시작 - 자동

```mermaid
flowchart LR
A[10분마다 실행] --> B[startAt이 현재보다 과거인 SCHEDULED 상태의 이벤트 검색]
B --> C{이벤트가 존재하는가?}
C -->|No| AAA[종료]
C -->|Yes| D[event.start]
D --> AAA
```

### Reward context

#### 보상 등록 (private)

```mermaid
flowchart LR
A[요청] --> B{OPERATOR or ADMIN 인가?}
B -->|No| AA[error]
B -->|Yes| C{eventId에 해당하는 event가 존재하는가?}
C -->|No| AA
C -->|Yes| D{event가 SCHEDULED, PROCESSING 상태인가?}
D -->|No| AA
D -->|Yes| E[Reward 등록]
E --> 종료
```

#### 보상 조회 (private)

```mermaid
flowchart LR
A[요청] --> B{OPERATOR or AUDITOR or ADMIN 인가?}
B -->|No| AA[error]
B -->|Yes| C[조건에 맞는 이벤트 반환]
C --> 종료
```

### Reward-Request context

#### 보상 요청 등록 (private)

```mermaid
flowchart LR
A[요청] --> B{USER or ADMIN 인가?}
B -->|No| AA[error]
B -->|Yes| C{Event, Reward가 존재하는가?}
C -->|No| AA
C -->|Yes| D{Event가 COMPLETED or PROCESSING 상태인가?}
D -->|No| AA
D -->|Yes| E{이미 해당 event에 보상 요청을 했는가?}
E -->|Yes| AA
E -->|No| F{보상이 수동으로 주어지는가?}
F -->|Yes| G[Requested 상태의 보상 등록]
F -->|No| H{해당 이벤트에 activity가 reward가 요구하는 요구치 이상인가?}
H -->|No| GG[Rejected 상태의 보상 등록]
H -->|Yes| GGG[APPROVED 상태의 보상 등록]
```

#### 보상 요청 조회 (private)

```mermaid
flowchart LR
A[요청] --> B{USER or OPERATOR or AUDITOR or ADMIN 인가?}
B -->|No| AA[error]
B -->|Yes| C{요청자가 USER 권한인가?}
C -->|No| D[조건에 맞는 보상요청 반환]
C -->|Yes| E[조건에 맞는 자신의 보상 요청 반환]
D --> AAA[종료]
E --> AAA
```

#### 보상 요청 승인 (private)

```mermaid
flowchart LR
A[요청] --> B{OPERATOR or ADMIN 인가?}
B -->|No| AA[error]
B -->|Yes| C{Reward Request가 존재하는가?}
C -->|No| AA
C -->|Yes| D{REQUESTED 상태인가?}
D -->|No| AA
D -->|Yes| E[Approved 상태로 변경, 변경시각 기록]
E --> 종료
```

#### 보상 요청 거절 (private)

```mermaid
flowchart LR
A[요청] --> B{OPERATOR or ADMIN 인가?}
B -->|No| AA[error]
B -->|Yes| C{Reward Request가 존재하는가?}
C -->|No| AA
C -->|Yes| D{REQUESTED 상태인가?}
D -->|No| AA
D -->|Yes| E[REJECTED 상태로 변경, 변경시각 기록]
E --> 종료
```

### Activity context

#### 출석 이벤트 참여 활동 기록

```mermaid
flowchart LR
A[유저 로그인] --> B[UserLoggedInEvent 발행]
B --> C[Kafka]
D[ActivityController] -->|Consume| C
D --> E{ATTENDANCE 타입의 진행중인 이벤트가 있는가?}
E -->|No| AAA[종료]
E -->|Yes| F{이미 오늘 출석한 activity가 존재하는가?}
F -->|Yes| AAA
F -->|No| G[Activity 생성]
G --> AAA
```
