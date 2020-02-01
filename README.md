# nodejs_cosmosx_test
노드 운영을 위한 프로젝트

aws에 nodejs서버 구축하기
 
 Visual Studio Code단축키 및 사용법
 - ctrl + shift + p  → git clone  git복제   사이트 → 내컴퓨터
 - ctrl + Enter → 커밋메세지적고 적용
 - 여러번 반복하다보면   풀-> 푸시-> 커밋

AWS 사용확인
 - 보안을 위하여  nginx를 설치한다
 - 테스트를 위하여 포트를 열어줬다 확인후 지운다
 - nginx 설정에서 해당 사이트를 연결해준다

PUTTY 이용하여 접속하기
- 폰트설정 : Windows-Appearance-Font setting
- 키경로 : Connection-SSH-Auth-Private key file for authentication
→ Puttyen 이용하여 키변경하기

참고사이트
- https://demun.github.io/vscode-tutorial/git/#git


Guthub유의사항
- 다운폴더 정확하게 지정하기111
111


Atlas 설정사항
- 접속설정(포트) 후 접속계정 설정(아이디 비번) 접속주소를 받는다(종류별로
- 몽구스접속: mongodb+srv://아이디:비번@프로젝트명-pqydf.mongodb.net/db명?retryWrites=true&w=majority')

  DB바로접속: mongodb+srv://아이디:비번@프로젝트명-pqydf.mongodb.net/프로젝트명?retryWrites=true&w=majority')

- 몽고DB 몽구스 버전에 따라 설정법이 다르니 꼭 참고하삼

 ├── 몽고DB 2.x.x :
      ├── 2.x.x : 왠만한 시중교재는 이버전으로 설명
      ├── 3.3.4 : 내가 셋팅한 버전 → var db = client.db('데이터베이스 이름') //client는 function반환값
                    database = mongoose.connection.openUri(databaseUrl,{useNewUrlParser: true });


- GIT명령어 정리 : https://rogerdudler.github.io/git-guide/index.ko.html