import * as theme from "../dist/index.js"; // 테마 모듈을 불러오기
import fs from "fs"; // 파일 시스템 모듈을 불러오기

// camelCase 또는 PascalCase를 kebab-case로 변환하는 함수
const toCssCasting = (str) => {
  return str
    .replace(/([a-z])(\d)/, "$1-$2") // 소문자와 숫자 사이에 하이픈 추가
    .replace(/(A-Z)/g, "-$1") // 대문자 앞에 하이픈 추가
    .toLowerCase(); // 문자열 전체를 소문자로 변환
};

// 테마의 CSS 변수를 생성하는 함수
const generateThemeCssVariables = () => {
  const cssString = [];

  // 테마 변수들을 순회하며 처리
  Object.entries(theme.vars).forEach(([key, value]) => {
    if (key === "colors") {
      // 색상 관련 변수를 처리
      Object.entries(value.$static).forEach(([colorKey, colorValue]) => {
        if (colorKey === "light") {
          const selector = ":root";

          // CSS 변수를 생성
          const cssVariables = Object.entries(colorValue)
            .map(([mainKey, mainValue]) =>
              Object.entries(mainValue)
                .map(
                  ([subKey, subValue]) =>
                    `--${toCssCasting(mainKey)}-${toCssCasting(
                      subKey
                    )}: ${subValue}`
                )
                .join("\n")
            )
            .join("\n");

          cssString.push(`${selector} {\n${cssVariables}\n}`);
        }
      });
    }
  });

  return cssString;
};

// 테마의 CSS 파일을 생성하는 함수
const generateThemeCss = () => {
  const variables = generateThemeCssVariables();

  // CSS 파일을 생성하여 저장
  fs.writeFileSync("dist/themes.css", [...variables].join("\n"));
};

// 테마 CSS 파일 생성 함수 호출
generateThemeCss();
