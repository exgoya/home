# GOLDILOCKS - Jboss(Wildfly) 연동 가이드 

## 목차


1. [개요](#개요)
2. [Jboss 사용자 생성](#jboss-사용자-생성)
3. [JAVA 설치](#java-설치)
4. [Jboss(7.1.1) 설치](#jboss-설치)
5. [Jboss 기동](#jboss-aws-기동)
6. [goldilocks 연동](#goldilocks-연동)
7. [APP Test](#app-test)
8. [배포](#배포)
9. [Check](#check)
10. [XA DataSource 연결](#xa-datasource-연결)
11. [Wildfly(16.0.0) 연동시 주의사항](#wildfly-연동시-주의사항)

## 개요
* GOLDILOCKS JDBC Driver 를 이용하여 Jboss 와 연동하는 방법을 설명한다.
* 설치 시, 환경이 맞지 않아 에러가 발생하는 경우 사용자가 설치해야한다.

###### [ 테스트 환경 ]

###### * Jboss 계정에 Jboss 를 설치하며, 계정은 Goldilocks glsnr(TCP) port 를 통해 Goldilocks 에 접속할 수 있어야 한다.
###### * Jboss 기동시 실행되는 port에 대한 방화벽이 열려있어야 한다. (default : 8080,9990,8443..)

<h6>

    OS Server   : CentOS Linux release 7.6.1810
    DATABASE    : Goldilocks 3.2.2 r27513
    JDK         : java version "1.7.0_211"
    Jboss       : Jboss AS 7.1.1
    Wildfly     : wildfly 17.0.0

</h6>

## Jboss 사용자 생성

#### 2 - 1. 사용자 계정을 생성한다.

###### [ 사용자 계정 환경설정 ]
<h6>

    USER  : jboss
    HOME  : /home/jboss
    SHELL : bash
    
</h6>

<h6>

    $ useradd -d /home/jboss -s /bin/bash jboss
    
</h6>

#### 2 - 2. 사용자 계정 비밀번호를 변경한다.
<h6>

    $ passwd sunje
    
</h6>

#### 2 - 3. 사용자 계정 비밀번호를 변경한다.
<h6>

    $ su - sunje
    
</h6>
 
## JAVA 설치
###### Jboss버전에 따라 알맞은 java version을 설치해야 한다.
###### Jboss 7.1.1 = jdk 1.7
###### Wildfly 17.0.0 = jdk 1.8


#### 3 - 1. java 1.7 다운로드 & 압축풀기

###### https://www.oracle.com/technetwork/java/javase/downloads/java-archive-downloads-javase7-521261.html
###### 위 링크에서 jdk를 다운받도록 한다.

###### 압축을 해제한다.
<h6>

    $ tar -zxvf jdk-7u80-linux-x64.tar.gz
    
</h6>

#### 3 - 2. 환경변수를 설정한다.

###### ~/.bash_profile
<h6>

    export JAVA_HOME=/home/jboss/java/jdk1.7.0_80 
    export PATH=$JAVA_HOME/bin:$PATH
    
</h6>

<h6>

    $ source ~/.bash_profile
    
</h6>

## Jboss 설치

#### 4 - 1. Jboss as 7.1.1 download & 압축풀기

<h6>

    $ wget http://download.jboss.org/jbossas/7.1/jboss-as-7.1.1.Final/jboss-as-7.1.1.Final.zip
    $ unzip jboss-as-7.1.1.Final.zip
    
</h6>

#### 4 - 2. JBOSS 환경변수 설정

###### ~/.bash_profile

<h6>

    $ export JBOSS_HOME=/home/jboss/product/jboss-as-7.1.1.Final
    $ export PATH=$JBOSS_HOME/bin:$PATH
    
</h6>
<h6>

    $ source ~/.bash_profile
    
</h6>

## Jboss AWS 기동

###### 기동하기전 jboss-modules.jar 기본 모듈에 문제가 있으므로 fix된 버전의 module으로 교체해주도록 한다.
###### 관련 페이지 : https://stackoverflow.com/questions/48403832/javax-xml-parsers-factoryconfigurationerror-running-jboss-as-7-1-with-java-7-upd

<h6>

    $ wget http://repo1.maven.org/maven2/org/jboss/modules/jboss-modules/1.1.5.GA/jboss-modules-1.1.5.GA.jar
    $ mv jboss-modules-1.1.5.GA.jar jboss-modules.jar
    
</h6>

#### 5 - 1. add admin user

###### add-user.sh ( 아래의 방법이 안될때는 PATH환경변수 설정을 확인해 보거나, $JBOSS_HOME/bin 에가서 직접 실행해도 무방하다. )

<h6>

    $ add-user.sh

    What type of user do you wish to add?
     a) Management User (mgmt-users.properties)
     b) Application User (application-users.properties)
    (a): a

    Enter the details of the new user to add.
    Realm (ManagementRealm) :                       #비워둔다..
    Username : jboss
    Password : jboss1234
    Re-enter Password : jboss1234
    About to add user 'jboss' for realm 'ManagementRealm'
    Is this correct yes/no? yes
    Added user 'jboss' to file '/home/jboss/product/jboss-as-7.1.1.Final/standalone/configuration/mgmt-users.properties'
    Added user 'jboss' to file '/home/jboss/product/jboss-as-7.1.1.Final/domain/configuration/mgmt-users.properties'
    
</h6>

#### 5 - 2. jboss aws 기동

###### start (port옵션을 줌으로써 외부 접속이 허용이된다. 기본은 local만 허용)
###### conf를 수정하는 방법도 있다. -> $JBOSS_HOME/standalone/configuration/standalone.xml 수정 후 실행

<h6>

    $ standalone.sh

    #외부 접속 허용 (default 127.0.0.1)
    $ standalone.sh -Djboss.bind.address=0.0.0.0 -Djboss.bind.address.management=0.0.0.0
    
</h6>

###### 0.0.0.0:8080 web server가 구동이된 모습이다.
![jboss_home](https://github.com/exgoya/home/blob/master/images/jboss_home.jpg)
###### 0.0.0.0:9990 Adminstration Console (add-user.sh 에서 설정한 id/pwd 를 입력하면 접속할 수 있다.
![jboss_admin](https://github.com/exgoya/home/blob/master/images/jboss_admin.jpg)

#### 5 - 3. shutdown

###### jboss server가 정상적으로 내려가지 않았을 때 아래와 같은 방법으로 shutdown 할 수 있다.
###### shutdown

<h6>

    $ ./jboss-cli.sh --connect command=:shutdown  
    
</h6>

## GOLDILOCKS 연동

#### 6 - 1. goldilocks jdbc driver copy

<h6>

    $ ~/jboss-as-7.1.1.Final/modules/com/goldilocks/jdbc/main
    $ ls
    goldilocks7.jar    module.xml

    $ cd $JBOSS_HOME/modules/com
    $ mkdir -p goldilocks/jdbc/main
    $ cd goldilocks/jdbc/main

    $ cp $GOLDILOCKS_HOME/lib/goldilocks7.jar .

</h6>

#### 6 - 2. goldilocks module.xml 추가
###### vi $JBOSS_HOME/modules/com/goldilocks/jdbc/main/module.xml
<h6>

    <module xmlns="urn:jboss:module:1.1" name="com.goldilocks.jdbc">

        <resources>
            <resource-root path="goldilocks7.jar"/>
            <!-- Insert resources here -->
       </resources>
       <dependencies>
            <module name="javax.api"/>
            <module name="javax.transaction.api"/>
            <module name="javax.servlet.api" optional="true"/>
      </dependencies>
    </module>
    
</h6>

#### 6 - 3. standalone.xml에 datasource 추가
###### vi $JBOSS_HOME/standalone/configuration/standalone.xml
<h6>

    <subsystem xmlns="urn:jboss:domain:datasources:1.0">
        <datasources>
            <datasource jndi-name="java:jboss/datasources/goldilocks" pool-name="goldilocks" enabled="true" use-java-context="true">
                <connection-url>jdbc:goldilocks://192.168.0.119:22125/goldilocks</connection-url>
                <driver>goldilocks7</driver>
                <security>
                    <user-name>test</user-name>
                    <password>test</password>
                </security>
            </datasource>
            <drivers>
                <driver name="goldilocks7" module="com.goldilocks.jdbc">
                    <driver-class>sunje.goldilocks.jdbc.GoldilocksDriver</driver-class>
                </driver>
            </drivers>
        </datasources>
    </subsystem>
    
</h6>

#### 6 - 4. log 확인
<h6>

    $ standalone.sh
    .
    .
    18:27:50,205 INFO  [org.jboss.as.connector.subsystems.datasources] (ServerService Thread Pool -- 27) JBAS010404: Deploying non-JDBC-compliant driver class sunje.goldilocks.jdbc.GoldilocksDriver (version 1.1)
    .
    18:27:50,363 INFO  [org.jboss.as.connector.subsystems.datasources] (MSC service thread 1-89) JBAS010400: Bound data source [java:jboss/datasources/goldilocks]

</h6>

#### 6 - 5. datasources 확인
![datasource](https://github.com/exgoya/home/blob/master/images/datasource.jpg)

## APP TEST

#### 7 - 1. test.java
###### test.java

<h6>

    @SuppressWarnings("finally")
         public String getDB() {
             DataSource ds = null;
             Connection conn = null;
             PreparedStatement stmt = null;
             InitialContext ctx;

             StringBuffer buf = new StringBuffer();
             try {
                 ctx = new InitialContext();
                 ds = (DataSource) ctx.lookup("java:jboss/datasources/goldilocks");
                 conn = ds.getConnection();
                 stmt = conn.prepareStatement("select * from t1");
                 ResultSet rs = stmt.executeQuery();
                 while (rs.next()) {
                     buf.append("
        " + rs.getString(1));
                 }
                 rs.close();
                 stmt.close();
             } catch (Exception e) {
                 buf.append("Exception Encountered : " + e);
             } finally {
                 if (conn != null) {
                     try {
                         conn.close();
                     } catch (SQLException e) {
                         // TODO Auto-generated catch block
                         e.printStackTrace();
                     }
                 }
                 return buf.toString();
             }
     }
    
</h6>

#### 7 - 2. index.jsp
###### index.jsp
<h6>
    
    <%Test test = new Test(); %>
    <h1>get DB</h1>
    <p><%=test.getDB() %></p>
    
</h6>

## 배포
###### manage deployments > add content > war file upload > enable click > check

![add_project](https://github.com/exgoya/home/blob/master/images/add_project.jpg)

## Check
<h6>
    
    gSQL> select * from t1;

       COL1
    -------
          5
          2
          5
    1213124
      12312

    5 rows selected.
    
</h6>

![check](https://github.com/exgoya/home/blob/master/images/check.jpg)

## XA DataSource 연결

###### conf
<h6>
    
    <xa-datasource jndi-name="java:jboss/datasources/goldilocksXADS" pool-name="goldilocksXADS" enabled="true" use-java-context="true">
        <xa-datasource-property name="URL">jdbc:goldilocks://192.168.0.119:22125/test</xa-datasource-property>
        <driver>goldilocks7</driver>
        <security>
            <user-name>test</user-name>
            <password>test</password>
        </security>
    </xa-datasource>

    <driver name="goldilocks7" module="com.goldilocks.jdbc">
        <driver-class>sunje.goldilocks.jdbc.GoldilocksDriver</driver-class>
        <xa-datasource-class>sunje.goldilocks.jdbc.GoldilocksXADataSource</xa-datasource-class>
        <datasource-class>sunje.goldilocks.jdbc.GoldilocksDataSource</datasource-class>
    </driver>
    
</h6>

###### http://localhost:9990
![xa_datasource](https://github.com/exgoya/home/blob/master/images/xa_datasource.jpg)

## Wildfly 연동시 주의사항
###### 이전의 jboss가 wildfly로 이름이 바뀌어 업데이트가 되고있다.
###### 이 챕터에서는 wildfly(16.0.0)와 jboss(7.1.1)의 설치시 차이점만 기술하도록 한다.

#### 11 - 1. module 폴더구조가 바뀌었다.

<h6>
    
    ~/jboss-as-7.1.1.Final/modules/com/goldilocks/jdbc/main

    ~/wildfly-16.0.0.Final/modules/system/layers/base/com/goldilocks/jdbc/main

</h6>

#### 11 - 2. datasource property
###### datasource 추가시 \<connection-property name="URL"> 을 사용한다. (\<connection-url>를 사용하지 않는다.)

<h6>
    
###### connection-property (datasource)

    <connection-property name="URL">
        jdbc:goldilocks://192.168.0.111:22581/goldilocks
    </connection-property>

###### XA datasource property

    <xa-datasource-property name="URL">
        jdbc:goldilocks://192.168.0.111:22581/goldilocks
    </xa-datasource-property>
    
</h6>
