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