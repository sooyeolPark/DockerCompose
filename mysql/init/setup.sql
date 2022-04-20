ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'psy1234';
FLUSH PRIVILEGES;

CREATE DATABASE init_test;
CREATE TABLE init_test.Users (
    `idx` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'PK',
    `id` varchar(20) NOT NULL COMMENT '아이디',
    `password` varchar(30) NOT NULL COMMENT '비밀번호',
    `name` varchar(20) NOT NULL COMMENT '이름',
    `created_at` DATETIME NOT NULL DEFAULT NOW() COMMENT '생성일',
    PRIMARY KEY (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO init_test.Users (`id`, `password`, `name`) VALUES ('clap10', 'psy1234', '수열이');