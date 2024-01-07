import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import style from "./style.module.css";
import axios from "axios";
import { familyContext } from "../../Layout";

export default function Register() {
  const { setFamily } = useContext(familyContext);
  const [teams, setTeams] = useState([]);
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  const nav = useNavigate();
  const onFinish = async (values) => {
    values.my_family = [];
    const res = await axios.post(
      `${import.meta.env.VITE_BASIC_SERVER}api/register`,
      values
    );
    setFamily(res.data);
    nav("../addusers");
  };
  const onFinishFailed = (errorInfo) => {};
  const go = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BASIC_SERVER}api/team_challenge/All`
    );
    setTeams(
      res.data.map((team) => {
        return {
          value: team._id,
          label: new Date(team.date).toLocaleDateString("en-GB"),
        };
      })
    );
  };
  useEffect(() => {
    go();
  }, []);
  return (
    <div className={style.login}>
      <Form
        className={style.form}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "נא למלא אימייל תקין",
            },
            {
              pattern: emailRegex,
              message: "נא למלא אימייל תקין",
            }
          ]}
        >
          <Input placeholder="דואר אלקטרוני" className={style.input_item} />
        </Form.Item>
        <Form.Item
          name="familyName"
          rules={[
            {
              required: true,
              message: "בבקשה הכנס שם משפחה",
            },
          ]}
        >
          <Input placeholder="שם משפחה" className={style.input_item} />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "נא להזין סיסמא",
            },
            {
              pattern: passRegex,
              message:'סיסמא צריכה להיות לפחות 8 תוים עם אות אחת גדולה, אות אחת קטנה, מספר ותו מיוחד'
            }
          ]}
        >
          <Input.Password placeholder="סיסמא" className={style.input_item} />
        </Form.Item>
        <Form.Item
          name="teamChallenge"
          rules={[
            {
              required: true,
              message: "בבקשה בחר קבוצה",
            },
          ]}
        >
          <Select
            options={teams}
            className={style.input_item}
            placeholder="בחר תאריך"
            style={{ width: "180px" }}
          />
        </Form.Item>

        <Form.Item className={style.form_item}>
          <Button type="primary" htmlType="submit" className={style.Button}>
         הרשמה לאתגר
          </Button>
        </Form.Item>
      </Form>

      <Button
        type="link"
        htmlType="button"
        onClick={() => {
          nav("/sign");
        }}
        className={style.link_button}
      >
       יש לי כבר חשבון
      </Button>
    </div>
  );
}
