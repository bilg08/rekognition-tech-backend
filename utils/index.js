const aws = require("aws-sdk");

module.exports.response = (statusCode, message) => {
  const success = statusCode === 200 ? true : false;
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: JSON.stringify({
      success: success,
      data: message,
    }),
  };
};

module.exports.invokeLambda = async (functionName, payload) => {
  const lambda = new aws.Lambda();
  const res = await lambda
    .invoke({
      FunctionName: functionName,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({ body: payload }),
    })
    .promise();
  const rPayload = JSON.parse(res.Payload);
  const body = JSON.parse(rPayload?.body);
  const data = body?.data;

  return data;
};

function convertEnglishToCyrilic(texts) {
  // парамаараа Array<string> авна Жишээ нь ['Sh', U]
  // Буцаах утга [ш, у]
  const alphabetKey = {
    A: "а",
    B: "б",
    V: "в",
    D: "д",
    Ye: "е",
    Yo: "ё",
    J: "ж",
    Z: "з",
    I: "и",
    K: "к",
    L: "л",
    M: "м",
    N: "н",
    O: "о",
    P: "п",
    R: "р",
    S: "с",
    T: "т",
    U: "у",
    F: "ф",
    Kh: "х",
    Ts: "ц",
    Ch: "ч",
    Sh: "ш",
    E: "э",
    Yu: "ю",
    Ya: "я",

    // i: "й",
    // Ө: "Ө",
    // ү: "ү",
    // щ: "щ",
    // ъ: "ъ",
    // ы: "ы",
    // ь: "ь",
  };
  return texts.map((text) => alphabetKey[text]);
}

function convertRegNumToCyrillic(text) {
  //text = ShU03284015

  // register number ын үсэгтэй хэсгийг салгаж авч байна. Жнь: ShU
  let firstTwoLetter = text.split(/[\W\d]+/).join("");
  // тоотой хэсгийг нь салгаж авч байна. Жнь: 03284015
  const lastNumbers = text.split(/[^\d]+/).join("");

  // эхний хоер үсэг нийлсэн байгааг үсэг үсгээр салгаж авч байна Жнь: ShU => ["Sh", "U"];
  const splittedCharecters = firstTwoLetter.split(/(?=[A-Z])/);
  firstTwoLetter = convertEnglishToCyrilic(splittedCharecters).join(""); // ["ш", "у"] => "шу"
  return firstTwoLetter + lastNumbers;
}

module.exports.convertUserInfo = (texts) => {
  console.log(texts, "FROM DETECT ");
  const result = {};

  // эхнийх 2-4 нь үсэг бусад нь тоо байх естой
  const regNumberRegex = new RegExp("^[a-zA-Z]{2,4}[0-9]{6}$");
  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];

    // ovog
    if (text.includes("Surname")) result["lastName"] = texts[i + 1];

    // ner
    if (text.includes("Given name")) result["firstName"] = texts[i + 1];

    // regNumber
    if (text.includes("Registration number")) {
      // 'WY03283015 / ShU03283015' ингэж ирж байгаа
      // регистерийн дугаар англиар авч байгаа Монголоор авхаар
      // заримдаа буруу таниж байсан
      // ShU03283015
      const regNumByEnglish = texts[i + 1].split("/")[1].replace(" ", "");
      result["registrationNumber"] = convertRegNumToCyrillic(regNumByEnglish);
    }
    // torson on sar
    if (text.includes("birth")) result["birthday"] = texts[i + 1];
  }

  return result;
};
