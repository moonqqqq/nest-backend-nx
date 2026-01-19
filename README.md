LLM 호출/응답 스트리밍 관리 마이크로서비스 백엔드 구현

# 목표
1. 여러 프로젝트에서 llm을 구축하는 시간과 비용을 절약한다. [LLM streaming microservice]
2. LLM 스트리밍 기능의 안정성을 높인다. (실패율 최소화, 복잡한 코드 없애기)
    - LLM 자체의 에러 발생이 꽤나 흔함.
    - 클라이언트, 네트워크 에러로 인해 LLM 응답을 보호해야함.

단순히 짧은 LLM응답뿐 만아니라 딥리서치 응답까지 장시간 안전히 streaming받을수 있는 구조를 목표로 한다.
중간에 streaming 연결이 끊겨도 자연스럽게 다시 연결되는 것을 목표로 한다.

# 방식
1. LLM 서버 URL과 요청값들을 설정하면 기존 만들어진 기능으로 호출할 수 있어야한다.
2. 1번 작업이 완료되면 응답값으로 streamId를 전달한다.
3. 2번에서 받은 streamId를 이용하며 llm 응답을 어느 상황에서든 안정적으로 streaming 받을수 있다.


# 인프라 구성

1. API Gateway Server
2. Kafka consumer(Background Consumer Server)
: 모든 스트림 이벤트들을 처리
3. Redis
: 클라이언트에게 쏴야할 이벤트들을 생명주기동안 저장해두는 공간 Redis Stream을 이용
4. DB
: llm 응답이 성공하거나 실패로 끝났을 때 지금까지 응답한 내용을 저장

# TODO

1. 기본 API 구현
  - [x] 1.1. 간단한 login 흐름
  - [x] 1.2. LLM Session(chatroom) 생성, 조회 API 구현
  - [x] 1.3. LLM Message 생성, 목록 조회 API 구현
2. 전체 서버에서 이용할 Streaming event 객체 표준화
  - [x] 2.1. 필요 데이터: sequence 값, event type, payload, etc... // sequence는 redis stream에서 관리해서 불필요 event.id 로 알아서 관리됨.
  - [x] 2.2. 필요 이벤트: 실행, 중간 메시지, 종료, 실패, ...
  - [x] 2.3. LLM Response Message의 상태 추가 (pending, processing, completed, failed ...)
3. LLM 응답 구현
  - [x] 3.1 Mock LLM  응답 스트리밍 서버 구현
4. 이벤트 스트리밍 시스템 구축 (Kafka)
  - [x] 4.1. 여러 마이크로서비스들에서 이용할 eventStreamingModule 만들기
    - [x] 4.1.1. 토픽정리
    - [x] 4.1.2. produce 기능
    - [x] 4.2.3. consume 기능
    - [x] 4.2.4. 안정성 위주의 카프카 설정들 구성하기 (producer, brocker, consumer)
5. LLM Streaming 백그라운드 파이파라인 구축(API서버와 완전한 분리) (Redis)
  - [x] 5.1. [불필요] Redis 키 생성 구조 구현(cluster에서 유효한 키 방식) 
  - [ ] 5.2. Redis pubsub 으로 응답 메시지 구독
  - [ ] 5.3. 채팅방에 다시 들어왔을 때 응답이 아직도 생성중이라면 진행과정 다시 보여줄수 있도록 임시저장소 구현
  - [ ] 5.4. 하나의 스트리밍으로 부터 들어오는 이벤트들을 여러 곳에서 구독할수 있는 프로세스 구현 (ex. 사용 토큰 계산, 통계처리 등 파이프라인 시작단계)
  - [ ] 5.4. 에러 처리
    - [ ] 5.4.1. LLM 자체 실패시 재시도 로직
  - [ ] 카프카와 함께 멱등성 처리
6. Streaming 게이트웨이 (Client Interface) 구현
  - [ ] 6.1. streamId를 통한 Streaming 연결 API 구현
    - [ ] 6.1.1. 중간에 재연결 가능하도록
    - [ ] 6.1.2. Last-Event-ID 로 원하는 지점부터 가져올수 있도록.
  - [ ] 6.2. streamId를 통한 streaming 강제 중단 API.
7. LLM 응답 이벤트를 구독하는 파이프라인
  - [ ] 7.1. 토큰 사용량 측정 파이프라인(유저 플랜에 따른 제약 구현)
  - [ ] 7.2. 로그 수집 파이프라인
8. 부하 테스트
  - [ ] 8.1. 현재 시스템에 맞는 인프라 선택하기(다른 머신들과 비교)
  - [ ] 8.2. 최소한의 컴퓨터 사양으로 부하 테스트진행, 성능향상 시키기 기록
    - [ ] 8.2.1. lag 감지 => 에 따른 컨수머 확장 기능

# Flow
```
================================================================================
  PHASE 1: 작업 요청 (Async Job Submission)
================================================================================

[ 👤 User / Frontend ]
       |
       | (A) "딥리서치 시작해줘" (POST /start)
       v
[ 🌐 API Server ]
       |
       | (B) Producer: 메시지 발행
       v
[ 📨 Kafka Cluster ]
       |
       | (C) Consumer: 메시지 수신
       v
[ ⚙️ Kafka Consumer Server ]
       |
       | (D) 작업 등록 (add job)
       v
[ 🐂 Redis BullMQ ] (Job Queue)


================================================================================
  PHASE 2: 작업 실행 & 실시간 스트리밍 (Execution & Streaming)
================================================================================
                                     |
                                     | (E) 작업 가져오기 (Process)
                                     v
                           [ 👷 Job Worker ] <====> [ 🤖 LLM Server ]
                                     |
           +-------------------------+-------------------------+
           | (Fast Path)             | (Gap Filler)            | (Write Buffer)
           |                         |                         |
           v                         v                         v
  [ 📢 Redis Pub/Sub ]      [ 🧊 Room Recent Cache ]    [ 📦 Global Save Queue ]
   (채널: room:{id})         (List: room:{id}:recent)    (List: global_queue)
           |                 - 최신 50개만 유지 (LTRIM)     - 무제한 적재
           |                 - 10분 뒤 만료 (TTL)
           |
           v
  [ 🌐 API Server ]
           |
           | (F) WebSocket / SSE 전송
           v
  [ 👤 User / Frontend ] (실시간 로그 확인 중...)


================================================================================
  PHASE 3: 비동기 저장 (Write-Behind Persistence)
================================================================================
                                                               |
                                                               | (G) 배치 가져오기 (LPOP 100개)
                                                               v
                                                      [ 💾 Log Saver Worker ]
                                                               |
                                                               | (H) 뭉쳐서 저장 (Bulk Insert)
                                                               v
                                                      [ 🗄️ MongoDB / DB ]
                                                      (영구 저장소)


================================================================================
  PHASE 4: 재접속 및 데이터 복구 (Hybrid Read / Reconnection)
================================================================================

[ 👤 User / Frontend ]
       |
       | (I) "나 다시 들어왔어, 전체 로그 줘" (GET /logs)
       v
[ 🌐 API Server ]
       |
       +---------------------------------------+
       |                                       |
       | (J) "옛날 데이터 다 줘"                 | (K) "저장 안 된 최신 데이터 줘"
       v                                       v
[ 🗄️ MongoDB / DB ]                  [ 🧊 Room Recent Cache ]
       |                                       |
       | (Log 1 ~ 99)                          | (Log 100 ~ 105)
       |                                       |
       +-------------------+-------------------+
                           |
                           v
                [ 🔄 API Server (Merger) ]
                "중복 제거 및 순서 정렬 (1 ~ 105)"
                           |
                           | (L) 응답 반환
                           v
                 [ 👤 User / Frontend ]
```

## Run app

개발용 Infra 실행 (kafka, postgres, redis)

```
docker compose --env-file .env.infra -f docker-compose-infra.yml up
```

To run the dev server for your app, use:

```sh
npx nx serve <app name> --output-style=stream

// 여러개 한번에 실행시키기
npx nx run-many --target=serve --all --output-style=stream

npx nx run-many --target=serve --projects=app1,app2 --output-style=stream
```

To create a production bundle:

```sh
npx nx build <app name>
```

To see all available targets to run for a project, run:

```sh
npx nx show project <app name>
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/nest:app apps/demo
```

To generate a new library, use:

```sh
npx nx g @nx/nest:lib libs/my-nest-lib
```

To generate nest.js module

```sh
npx nx g @nx/nest:resource apps/user-service/src/app/user/user
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
