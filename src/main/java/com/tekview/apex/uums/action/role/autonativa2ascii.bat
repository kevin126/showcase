@echo off
for /R %%i IN (.) DO (
if exist "%%i/package_zh_src.properties" native2ascii -encoding utf-8 "%%i/package_zh_src.properties" "%%i/package_zh_CN.properties"
if exist "%%i/package_zh_src.properties" native2ascii -encoding utf-8 "%%i/package_zh_src.properties" "%%i/package_zh.properties"
if exist "%%i/package_zh_src.properties" native2ascii -encoding utf-8 "%%i/package_zh_src.properties" "%%i/package.properties"
)
