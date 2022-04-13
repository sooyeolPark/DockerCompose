# DockerCompose
도커

1. window에서 DOCKER 설정
   1. window desktop버전 설치 시 WSL 2 installation is incomplete라고 경고창이 뜨는데 해당 경고창에 링크로 microsoft 지원페이지 들어가 업데이트 패키지를 받고 다운받아 깔아주니 잘 동작함 

2. docker-compose.yml 작성
   1. VERSION은 docker engine릴리즈 버전에 맞추어 사용하는 것이 좋다.
   2. https://docs.docker.com/compose/compose-file/
   
3. dockerfile 작성
   1. FROM : 베이스 이미지
   2. MAINTAINER : 이미지를 생성한 개발자의 정보 (1.13.0 이후 사용 X)
   3. LABEL : 이미지에 메타데이터를 추가 (key-value 형태)
   4. RUN : 새로운 레이어에서 명령어를 실행하고, 새로운 이미지를 생성한다.
      RUN 명령을 실행할 때 마다 레이어가 생성되고 캐시된다. (보통 라이브러리에 설치시 이용)
   5. WORKDIR : 작업 디렉토리를 지정한다. 해당 디렉토리가 없으면 새로 생성한다.
      작업 디렉토리를 지정하면 그 이후 명령어는 해당 디렉토리를 기준으로 동작한다.
      cd 명령어와 동일하다.
   6. EXPOSE : Dockerfile의 빌드로 생성된 이미지에서 열어줄 포트를 의미한다.
      호스트 머신과 컨테이너의 포트 매핑시에 사용된다.
   7. USER : 이미지를 어떤 계정에서 실행 하는지 지정
   8. COPY / ADD : build 명령 중간에 호스트의 파일 또는 폴더를 이미지에 가져오는 것
   9. ENV : 이미지에서 사용할 환경 변수 값을 지정한다.
   10. CMD / ENTRYPOINT : 컨테이너를 생성,실행 할 때 실행할 명령어
       1. CMD는 docker run 실행 시, 추가적인 명령어에 따라 설정한 명령어를 수정하고자 할 때 사용된다.
       2. ENTRYPOINT는 docker run 실행 시, 추가적인 명령어의 존재 여부와 상관 없이 무조건 실행되는 명령이다.

구조
1. proxy (nginx)
   1. nignx를 이용하여 reverse proxy로 이용
   2. 모든 접근이 이 컨테이너로 들어오며 들어온 request를 분류하여 내부 컨테이너로 중계한다.
   3. 80:80로 로컬 포트와 container port를 연결한다. 
   4. nginx.conf파일을 수정하여 server_name/tomcat 으로 들어오면 docker의 tomcat컨테이너의 8080포트로 연결한다.
   5. server_name/node로 들어오면 docker의 node컨테이너로 연결한다.
   6. server_name/컨테이너명으로하면 해당 컨테이너의 index로 들어온다고 생각했으나 해당 컨테이너 주소의 /컨테이너명으로 들어가게됨
      1. 위 문제는 나중에 해결해야할 듯

2. tomcat
   1. docker-compose.yml파일에 expose로 8080포트르 열어놓아 proxy서버에서 접근할 수 있게 만든다.
   2. 컨테이너가 실행되고 바로 닫히는 exited with code 0 문제가 발생함
      1. docker 컨테이너는 기본적으로 하나의 작업으 완료하면 자동으로 종료하게 되어있음
      2. 위 문제를 해결하기 위하여 종료되지 않는 프로세스를 만들어야하는데 supervisor를 깔고 실행시킴으로써 문제를 해결함

3. node
   1. node.js로 서버 구성
   2. docker-compose.yml과 Dockerfile을 사용하여 컨테이너를 빌드했는데 문제 발생
      1. docker-compose.yml의 volume에 node_modules를 연결시키고 Dockerfile에서 npm start했을때 package.json을 찾지 못하면서 npm start error
      2. dockerfile이 수행되면 모든 작업을 숨기고 현재 디렉터리로 바꾸는데 이때 pacakge.json이 없다 (이건 compose.yml파일에 넣어줬기 때문)
      3. volume부분 코드 삭제 후 dockerfile에서 모두 처리하게 수정

4. mysql
   1. mysql contianer로 연결하여 필요한 컨테이너에서 이용하게 하려고 함
   2. docker가 재부팅시에도 계속 쓸수 잇는 DB 만들기
      1. docker-compose의 volumes 설정으로 container안의 변경 사항이 local에 저장되어 재부팅시에도 data가 유지될 수 있도록 만든다.

** 유의사항
1. docker-compose build나 up 할 시 cache되어 수정한 내용이 반영이 안되거나 수정 코드와 동작 코드가 꼬일 수 있다
   1. docker-compose build --no-cache/ docker-compose up -d / docker-compose down명령어로 개발 단계에서는 수정사항이 즉각 반영되게 해주는게 좋다.
2. [ERROR] docker-compose build를 할때 max depth exceeded 라는 메세지와 함께 빌드 실패
   1. 사용 가능한 최대 레이어의 수는 125개이다. 이를 초과하면서 발생하는 문제인데...
      이때는 사용하던 기본 이미지를 삭제후, 다시 받아와 사용하면 해결된다.