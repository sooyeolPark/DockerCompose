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
      RUN 명령을 실행할 때 마다 레이어가 생성되고 캐시된다.
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


