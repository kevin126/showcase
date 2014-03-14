@echo off
for /R %%i IN (.) DO (
if exist "%%i/exceptionMassage_zh_src.properties" native2ascii -encoding utf-8 "%%i/exceptionMassage_zh_src.properties" "%%i/exceptionMassage_zh_CN.properties"
if exist "%%i/exceptionMassage_zh_src.properties" native2ascii -encoding utf-8 "%%i/exceptionMassage_zh_src.properties" "%%i/exceptionMassage_zh.properties"
if exist "%%i/exceptionMassage_zh_src.properties" native2ascii -encoding utf-8 "%%i/exceptionMassage_zh_src.properties" "%%i/exceptionMassage.properties"
)
