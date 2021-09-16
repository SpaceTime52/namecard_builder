import React, { useState, useEffect } from "react";
import $ from "jquery";
import { fire_db, fire_storage } from "fbase";
import { collection, addDoc } from "@firebase/firestore";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const [data, setData] = useState({
    officePhoneNum: "02-532-1237",
    faxNum: "02-6008-112",
    korName: "홍길동",
    korNickName: "의적",
    engName: "Gildong Hong",
    engNickName: "Robin Hood",
    jobTitle: "CEO",
    email: "mysc@mysc.co.kr",
    cellPhoneNum: "010-1234-5678",
    korAddress: "서울시 성동구 뚝섬로1나길 5, 헤이그라운드 G402",
    engAddress01: "Heyground G402, 5, Ttukseom-ro 1na-gil,",
    engAddress02: "Seongdong-gu, Seoul, Korea",
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    try {
      const svgdocs = $("#nameCardImg")[0].contentDocument.documentElement;
      svgdocs.getElementById("korName").innerHTML = data.korName;
      svgdocs.getElementById("korNickName").innerHTML = data.korNickName;
      svgdocs.getElementById("engName").innerHTML =
        data.engName + " | " + data.engNickName;
      svgdocs.getElementById("jobTitle").innerHTML = data.jobTitle;
      svgdocs.getElementById("email").innerHTML = data.email;
      svgdocs.getElementById("cellPhoneNum").innerHTML = autoHyphenTel(
        data.cellPhoneNum
      );
      svgdocs.getElementById("officePhoneNum").innerHTML = autoHyphenTel(
        data.officePhoneNum
      );
      svgdocs.getElementById("faxNum").innerHTML = autoHyphenTel(data.faxNum);
      svgdocs.getElementById("korAddress").innerHTML = data.korAddress;
      svgdocs.getElementById("engAddress01").innerHTML = data.engAddress01;
      svgdocs.getElementById("engAddress02").innerHTML = data.engAddress02;

      const svgdocsValue = new XMLSerializer().serializeToString(svgdocs);
      const encodedData =
        "data:image/svg+xml;base64," +
        btoa(unescape(encodeURIComponent(svgdocsValue)));
      setFile(encodedData);
    } catch {}
  }, [data]);

  const autoHyphenTel = (str) => {
    str = str.replace(/[^0-9]/g, "");
    var tmp = "";

    if (str.substr(0, 2) === "02") {
      // 서울 전화번호일 경우 10자리까지만 나타나고 그 이상의 자리수는 자동삭제
      if (str.length < 3) {
        return str;
      } else if (str.length < 6) {
        tmp += "82 " + str.substr(1, 1);
        tmp += " ";
        tmp += str.substr(2);
        return tmp;
      } else if (str.length < 10) {
        tmp += "82 " + str.substr(1, 1);
        tmp += " ";
        tmp += str.substr(2, 3);
        tmp += " ";
        tmp += str.substr(5);
        return tmp;
      } else {
        tmp += "82 " + str.substr(1, 1);
        tmp += " ";
        tmp += str.substr(2, 4);
        tmp += " ";
        tmp += str.substr(6, 4);
        return tmp;
      }
    } else {
      // 핸드폰 및 다른 지역 전화번호 일 경우
      if (str.length < 4) {
        return str;
      } else if (str.length < 7) {
        tmp += "82 " + str.substr(1, 2);
        tmp += " ";
        tmp += str.substr(3);
        return tmp;
      } else if (str.length < 11) {
        tmp += "82 " + str.substr(1, 2);
        tmp += " ";
        tmp += str.substr(3, 3);
        tmp += " ";
        tmp += str.substr(6);
        return tmp;
      } else {
        tmp += "82 " + str.substr(1, 2);
        tmp += " ";
        tmp += str.substr(3, 4);
        tmp += " ";
        tmp += str.substr(7);
        return tmp;
      }
    }
  };

  const onChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
  };

  const onChecked = (e) => {
    const value = e.target.checked;

    if (value) {
      setData({
        ...data,
        officePhoneNum: "064-2321-2123",
        faxNum: "None",
        korAddress: "제주지점 | 제주특별자치도 제주시 첨단로 330",
        engAddress01: "     세미양빌딩 A동 2층",
        engAddress02: "본 사 | 서울시 성동구 뚝섬로1나길 5, 헤이그라운드 G402",
      });
      window.document.getElementById("officePhoneNum").value = "064-2321-2123";
      window.document.getElementById("faxNum").value = "None";

      const svgdocs = $("#nameCardImg")[0].contentDocument.documentElement;
      svgdocs.getElementById("faxIcon").style.display = "none";
    } else {
      console.log(e.target.id);
      setData({
        ...data,
        officePhoneNum: "02-532-1237",
        faxNum: "02-6008-1126",
        korAddress: "서울시 성동구 뚝섬로1나길 5, 헤이그라운드 G402",
        engAddress01: "Heyground G402, 5, Ttukseom-ro 1na-gil,",
        engAddress02: "Seongdong-gu, Seoul, Korea",
      });
      window.document.getElementById("officePhoneNum").value = "02-532-1237";
      window.document.getElementById("faxNum").value = "02-6008-1126";
      console.log(data);
      const svgdocs = $("#nameCardImg")[0].contentDocument.documentElement;
      svgdocs.getElementById("faxIcon").style.display = "block";
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      //콜렉션에 data 저장
      const fileRef = await ref(fire_storage, `ordered/${uuidv4()}`);
      uploadString(fileRef, file, "data_url").then((snapshot) => {
        console.log("Uploaded a data_url string!");
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);

          setData({
            ...data,
            svgURL: downloadURL,
          });

          const docRef = addDoc(collection(fire_db, "namecard"), {
            ...data,
            svgURL: downloadURL,
          });

          console.log("Document written with ID: ", docRef.id);
        });
      });
    } catch (e) {
      console.error("Error adding doc: ", e);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-md-center row-cols-1 row-cols-lg-2 mt-5">
        <div className="col col-lg-5">
          <form>
            <div className="row mb-2">
              <div className="col">
                <div className="form-outline">
                  <input
                    type="text"
                    id="korName"
                    className="form-control"
                    onChange={onChange}
                  />
                  <label className="form-label mt-1" htmlFor="form6Example1">
                    한글 이름
                  </label>
                </div>
              </div>
              <div className="col">
                <div className="form-outline">
                  <input
                    type="text"
                    id="korNickName"
                    className="form-control"
                    onChange={onChange}
                  />
                  <label className="form-label mt-1" htmlFor="form6Example2">
                    한글 닉네임
                  </label>
                </div>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col">
                <div className="form-outline">
                  <input
                    type="text"
                    id="engName"
                    className="form-control"
                    onChange={onChange}
                  />
                  <label className="form-label mt-1" htmlFor="form6Example1">
                    영문 이름
                  </label>
                </div>
              </div>
              <div className="col">
                <div className="form-outline">
                  <input
                    type="text"
                    id="engNickName"
                    className="form-control"
                    onChange={onChange}
                  />
                  <label className="form-label mt-1" htmlFor="form6Example2">
                    영문 닉네임
                  </label>
                </div>
              </div>
            </div>
            <div className="form-outline mb-2">
              <input
                type="text"
                id="jobTitle"
                className="form-control"
                onChange={onChange}
              />
              <label className="form-label mt-1" htmlFor="form6Example3">
                직책 Title
              </label>
            </div>
            <hr className="m-3" />
            <div className="form-check d-flex mb-2">
              <input
                className="form-check-input me-2 mb-3"
                type="checkbox"
                value=""
                id="form6Example8"
                onChange={onChecked}
              />
              <label className="form-check-label" htmlFor="form6Example8">
                {" "}
                제주지사의 명함인가요?{" "}
              </label>
            </div>
            <div className="form-outline mb-2">
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="@"
                onChange={onChange}
              />
              <label className="form-label mt-1" htmlFor="form6Example4">
                이메일 Email
              </label>
            </div>
            <div className="form-outline mb-2">
              <input
                type="text"
                id="cellPhoneNum"
                className="form-control"
                placeholder="010-1234-5678"
                onChange={onChange}
              />
              <label className="form-label mt-1" htmlFor="form6Example5">
                핸드폰 번호
              </label>
            </div>
            <div className="form-outline mb-2">
              <input
                type="text"
                id="officePhoneNum"
                className="form-control"
                placeholder="02-532-1237"
                onChange={onChange}
              />
              <label className="form-label mt-1" htmlFor="form6Example5">
                사무실 전화번호
              </label>
            </div>
            <div className="form-outline mb-2">
              <input
                type="text"
                id="faxNum"
                className="form-control"
                placeholder="02-6008-1126"
                onChange={onChange}
              />
              <label className="form-label mt-1" htmlFor="form6Example5">
                팩스 번호
              </label>
            </div>
            <div className="form-outline mb-2">
              <input
                type="text"
                id="count"
                className="form-control"
                placeholder="200"
                onChange={onChange}
              />
              <label className="form-label mt-1" htmlFor="form6Example5">
                제작 수량
              </label>
            </div>
            <div className="form-outline mb-2">
              <textarea
                type="text"
                id="additionalRequest"
                className="form-control"
                placeholder="명함 인쇄 전에 연락을 받아보실 별도 연락처나 이메일, 특별히 받아보셔야 하는 택배 주소 등을 남겨주세요"
                onChange={onChange}
              />
              <label className="form-label  mt-1 mb-2" htmlFor="form6Example5">
                기타 요청 사항
              </label>
            </div>
            <hr className="m-3" />
            <div className="form-outline mt-4 mb-2">
              <input
                type="email"
                id="chargerEmail"
                className="form-control"
                placeholder="@"
                onChange={onChange}
              />
              <label className="form-label mt-1 mb-4" htmlFor="chargerEmail">
                담당자 이메일
              </label>
            </div>
            <div className="form-outline mb-2">
              <input
                type="email"
                id="chargerPhone"
                className="form-control"
                placeholder=""
                onChange={onChange}
              />
              <label className="form-label mt-1 mb-4" htmlFor="chargerEmail">
                담당자 연락처
              </label>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block mb-2"
              onClick={onSubmit}
            >
              주문 하기
            </button>
          </form>
        </div>

        <div className="col col-lg-7">
          <img src="/images/namecardTmp-01.svg" alt="" className="mb-2" />
          <object
            className="mt-4"
            type="image/svg+xml"
            id="nameCardImg"
            data="/images/namecardTmp-02.svg"
            name="namecard"
          >
            namecard image to revised and shown
          </object>

          <p className="m-4">
            * 명함 제작 시 정렬과 해상도, 텍스트의 굵기나 간격 등은 한번 더
            점검하고 진행됩니다. 위 시안은 컨텐츠와 배치 위주로 점검해주시기
            바랍니다.{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
