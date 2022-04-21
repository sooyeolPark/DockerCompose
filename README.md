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
   3. node_modules 폴더를 매번 카피하기 너무 무거워서 .gitignore생성하여 카피하지 않음
   4. mysql container와 연결 테스트 
      1. npm install express mysql Dockerfile에 추가함
      2. 테스트 코드 작성했으나 mysql 접속시 권한 문제 발생
         1. ALTER USER 'root'@'node' IDENTIFIED WITH mysql_native_password BY 'psy1234' 
         2. FLUSH PRIVILEGES
         3. ~~위 명령어 실행해야하지만 node부분에 ip를 적어주어야하는 문제 발생~~
         4. ~~docker-compose의 network 설정을 통해 시도해기로....~~
         5. 특정 IP 적지 않아도 node부분에 %라고 쓰면 허용된다.
         6. 나중에 특정 IP만 허용하려면 %대신 IP사용하면 됨

4. mysql
   1. mysql contianer로 연결하여 필요한 컨테이너에서 이용하게 하려고 함
   2. docker가 재부팅시에도 계속 쓸수 잇는 DB 만들기
      1. docker-compose의 volumes 설정으로 container안의 변경 사항이 local에 저장되어 재부팅시에도 data가 유지될 수 있도록 만든다.

** 유의사항
1. docker-compose build나 up 할 시 cache되어 수정한 내용이 반영이 안되거나 수정 코드와 동작 코드가 꼬일 수 있다
   1. docker-compose build --pull --force-rm --no-cache/ docker-compose up -d / docker-compose down명령어로 개발 단계에서는 수정사항이 즉각 반영되게 해주는게 좋다.
2. [ERROR] docker-compose build를 할때 max depth exceeded 라는 메세지와 함께 빌드 실패
   1. 사용 가능한 최대 레이어의 수는 125개이다. 이를 초과하면서 발생하는 문제인데...
      이때는 사용하던 기본 이미지를 삭제후, 다시 받아와 사용하면 해결된다.
3. docker mysql 이미지 올릴때 docker가 실행되면서 최초로 실행되는 sql문을 /docker-entrypoint-initdb.d에 넣어준다.
   1. 하지만 volume이 mysql의 data쪽에 잡혀있다면 최초에 실행되고 그 다음에는 실행되지 않는다.
      1. 정확히 말하면 최초 실행할때는 local의 volume이 비어있는상태에서는 실행됨
      2. local의 volume에 mysqldata가 있으면 실행되지 않는다.
      3. ~~나는 애초에 node에서 접근할 수 있는 권한을 주기위해 alter user ~~ 명령어를 실행하려고 한건데... volume에 상관없이 container를 실행할때마다 실행시키는 법을 찾아봐야겠다.~~
      4. mysql-volume에 처음 올라올때 설정 적용하면 volume이 지워지지 않는 이상 계속 유지되기 때문에 그럴 필요 없었다...
4. docker-compose.yml을 정리하려고 build 밑을 (context: ., dockerfile: ./node/Dockerfile) ->  (context: ./node, dockerfile: Dockerfile)로 바꾸었다가 빌드할 때 Dockerfile에서 failed to compute cache key: "/node" not found: not found과 같은 에러가 발생해서 오래 고생함
   1. Dockerfile에 COPY ../node ./node 이 부분이 문제였다.
   2. COPY ../node ./node를 COPY ./ ./node로 설정해주면 빌드가 잘된다.
   3. 의문점이 들어 이유를 찾아봤지만 찾지 못했다...
      1. yml -> (context: ., dockerfile: ./node/Dockerfile) 일때 
         1. COPY ../node ./node 동작
         2. COPY ./ ./node 이건 에러
      2. yml -> (context: ./node, dockerfile: Dockerfile) 일때 
         1. COPY ./ ./node 이건 동작 
         2. COPY ../node ./node 이건 에러

      3. 1번 항목은 dockerfile이 실행되는 곳이 DockerCompose/node안이 아니고 DockerCompose/???이라는거고
      4. 2번 항목은 dockerfile이 실행되는 곳이 DockerCompose/node안이다 
         1. 근데 애초에 DockerCompose/node안에 있으면 ./ 나 ../node나 똑같은데???
      5. Dockerfile의 동작 원리를 찾아보자 ~~(Layer기반과 관련이 있을듯...)~~
         1. Stackoverflow에 물어봄 
         2. https://stackoverflow.com/questions/71956228/why-docker-compose-and-dockerfile-working-this-way
         3. 답변과 몇번의 테스트를 통하여 이유를 찾음
            1. 보안상의 이유로 빌드 컨텍스트 디렉토리 또는 그 아래에 있는 호스트의 파일에만 액세스할 수 있다.
            2. context에 적힌 경로가 Root 디렉토리처럼 취급됨
               1. 1경우에는 context가 DockerCompose안이므로 파일을 제대로 복사해 가지 못함
                  1. 1-1경우는 테스트를 통해 알아냈는데 DockerCompose가 Root 디렉토리처럼 취급됨으로 ../node 라고 해도 ./node와 똑같은 취급이 되는 것 (실제로 둘다 정상동작한다.)
               2. 2경우에는 context가 이미 DockerCompose/node안이므로 ./는 동작하지만 ../node나 ./node로 찾으면 DockerCompose/node/node가 되는 것임으로 에러나는 것!


추가)
특정 이미지를 만들어서 배포하고 싶으면 docker-registry를 사용하면 된다.
1. DockerHub에 올릴때
   1. https://hub.docker.com/ 에 접속하여 repository를 만들면 repository이름을 부여받는다.
   2. 작업환경에서 image를 만들어 빌드할때 부여받은 repository이름으로 빌드한다.
   3. docker push repository 명령어를 입력하면 자동으로 repository에 image가 등록된다.
   4. 버전관리는 push 할때 repository:ver 식으로 하면 좋다.

2. Private Registry이용 (특정 서버에 올려놓는다고 가정함)
   1. 해당 서버에 Docker를 설치한다.
   2. docker pull registry 를 사용하여 registry 이미지를 다운받아 컨테이너를 가동시킨다.
      1. 포트를 지정하여 서버로 들어오는 포트를 설정하여 컨테이너로 바인딩 시켜준다.
      2. Container가 down되면 push해놓은 이미지들이 다 날라가기 때문에 컨테이너 안의 /var/lib/registry/docker/registry/v2 경로를 local에 볼륨을 잡아준다.
   3. 커스텀한 image를 서버IP:port/imagename:ver 이름으로 빌드한다.
      1. 예를 들어 registry 컨테이너를 가동시켜준 IP가 111.111.11.111이고
      2. port binding을 6000번 port를 바인딩하였고
      3. ELK스택 image를 만들었다면
      4. image를 빌드할때 111.111.11.111:6000/my-elk:1.0 이런식으로 네이밍하여 빌드한다.
   4. 빌드된 이미지를 docker push 서버IP:port/imagename:ver 하면 registry 컨테이너로 들어가 해당이미지를 pull받을 수 있게된다.
      1. docker registry는 https만 지원한다.
      2. 만약 http만 사용가능하다면 /etc/docker/daemon.json 파일에서 {
         "insecure-registries":["서버IP:port"]
         } 를 추가하면 http통신이 가능해진다.