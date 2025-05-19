# Event Server

Event Server는 이벤트, 리워드, 유저 이벤트 참여도 관리를 하는 서버입니다.

## 주요 기능

- 유저 관리
  - 유저 등록
  - 유저 역할 관리
- 로그인

## 프로젝트 구조

```
src/
├── libs/ # 공통 라이브러리
├── services/ # 서비스 모듈
├── test/ # 테스트 파일
├── app.module.ts # 루트 모듈
└── main.ts # 애플리케이션 엔트리 포인트
```

## 모델

### Event

```mermaid
classDiagram
    class Event {
        +string id
        +EventType type
        +Date? startAt
        +Date? endAt
        +EventStatus status
        +Date? transitAt
        +boolean canRewardEligible
        +from(type, startAt?, endAt?) Event
        +start() void
        +complete() void
        +cancel() void
    }

    class EventType {
        <<enumeration>>
        ATTENDANCE
    }

    class EventStatus {
        <<enumeration>>
        SCHEDULED
        PROCESSING
        COMPLETED
        CANCELLED
    }

    Event -- EventType
    Event -- EventStatus
```

### Reward

```mermaid
classDiagram
    class Reward {
        +string id
        +RewardType type
        +number amount
        +string eventId
        +string? referenceId
        +boolean isManual
        +number required
        +from(type, amount, eventId, referenceId?, isManual, required, registerValidator) Promise~Reward~
    }

    class RewardType {
        <<enumeration>>
        POINT
        ITEM
        COUPON
    }

    Reward -- RewardType
```

### RewardRequest

```mermaid
classDiagram
    class RewardRequest {
        +string id
        +RewardRequestStatus status
        +string userId
        +string eventId
        +string rewardId
        +Date requestedAt
        +Date? transitAt
        +from(userId, eventId, rewardId, status) RewardRequest
        +approve() void
        +reject() void
    }

    class RewardRequestStatus {
        <<enumeration>>
        REQUESTED
        APPROVED
        REJECTED
    }

    RewardRequest -- RewardRequestStatus
```

### Activity

```mermaid
classDiagram
    class Activity {
        +string id
        +string eventId
        +string userId
        +CalendarDate participatedOn
        +from(eventId, userId, participatedOn) Activity
    }

    class ActivityRegisteredEvent {
        +string activityId
        +string eventId
        +string userId
        +CalendarDate participatedOn
    }

    Activity ..> ActivityRegisteredEvent : publish
```
