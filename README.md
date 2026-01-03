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



# TODO

1. 기본 API 구현
  - [x] 1.1. 간단한 login 흐름
  - [ ] 1.2. LLM Chatroom 생성, 조회 API 구현
  - [ ] 1.3. LLM Message 생성, 목록 조회 API 구현
    - LLM Response Message의 상태 추가 (pending, processing, completed, failed ...)
2. 전체 서버에서 이용할 Streaming event 객체 표준화
  - [ ] 2.1. 필요 데이터: sequence 값, event type, payload, etc...
  - [ ] 2.2. 필요 이벤트: 실행, 중간 메시지, 종료, 실패, ...
3. 채팅 응답 LLM 구현
  - [ ] 3.1 Mock LLM 채팅 응답 스트리밍 서버 구현
  - [ ] 3.2. [1.3]API와 연결 - 여기까지는 단순 스트리밍
4. Streaming 백그라운드 파이파라인 구축(API서버와 완전한 분리)
  - [ ] 4.1. LLM서버로부터 Stream으로 받고 있는 데이터들을 임시 저장하는 저장소 구현
  - [ ] 4.2. 하나의 질문에 응답하는 동안만 stream 임시 저장소 살아있도록 리소스 효율화
  - [ ] 4.3. 하나의 스트리밍으로 부터 들어오는 이벤트들을 여러 곳에서 구독할수 있는 프로세스 구현 (ex. 사용 토큰 계산, 통계처리 등 파이프라인 시작단계)
  - [ ] 4.4. 에러 처리
    - [ ] 4.4.1. LLM 자체 실패시 재시도 로직
  - [ ] 4.5. 장시간 유지 작업
    - [ ] 4.5.1. keep alive 기능 구현
6. Streaming 게이트웨이 (Client Interface) 구현
  - [ ] 6.1. streamId를 통한 Streaming 연결 API 구현
    - [ ] 6.1.1. 중간에 재연결 가능하도록
    - [ ] 6.1.2. Last-Event-ID 로 원하는 지점부터 가져올수 있도록.
  - [ ] 6.2. streamId를 통한 streaming 강제 중단 API.

## Run app

개발용 Infra 실행 (kafka, postgres, redis)

```
docker compose --env-file .env.infra -f docker-compose-infra.yml up
```

To run the dev server for your app, use:

```sh
npx nx serve <app name> --output-style=stream

// 여러개 한번에 실행시키기
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
