import { Col, Row, Form, Input, Button, Select } from "antd"
import React, { useState, useEffect, useRef } from "react"
import { getChildrenToRender, trackEvent } from "../utils"
import { FormattedMessage, useIntl } from "gatsby-plugin-intl"
import createNotification from "../../components/Notification"
import axios from "axios"

const { TextArea } = Input
const { Option } = Select


export default function ContactForm(props) {
    const { dataSource, isMobile, ...tagProps } = props
    const [form] = Form.useForm()
    const intl = useIntl()

    const [loading, setLoading] = useState(false)
    const [payload, setPayload] = useState({})
    const isFirstRun = useRef(true)

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false
            return
        }
        if (payload.status === "Success") {
            createNotification(
                "success",
                'Gửi thông tin thành công',
                intl.formatMessage({ id: "noti.success.message" })
            )
            form.resetFields()
        } else {
            createNotification(
                "error",
                'Gửi thông tin không thành công',
                intl.formatMessage({ id: "noti.fail.message" }),
            )
        }
    }, [payload])

    const onFinish = values => {
        trackEvent("Gửi form liên hệ")
        setLoading(true)
        axios({
            method: "post",
            url: "https://demo.computervision.com.vn/backend/api/v1/leads",
            data: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => {
                setPayload(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }
    return (
        <>
            <div {...tagProps} {...dataSource.wrapper}>
                <div {...dataSource.page}>
                    <div {...dataSource.childWrapper}>
                        <Form
                            layout="vertical"
                            form={form}
                            onFinish={onFinish}
                            initialValues={{
                                name: "",
                                email: "",
                                phone: "",
                                company: "",
                                message: "",
                            }}
                            style={{ maxWidth: 800, margin: '0 auto' }}
                        >
                            <Row gutter={[30, 16]}>
                                <Col md={24} xs={24}>
                                    <Form.Item
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: intl.formatMessage({
                                                    id: "contact.name.message",
                                                }),
                                            },
                                        ]}
                                    >
                                        <Input placeholder={intl.formatMessage({ id: "contact.name" })} />
                                    </Form.Item>
                                </Col>
                                <Col md={24} xs={24}><Form.Item
                                    name="company"
                                >
                                    <Input placeholder={intl.formatMessage({ id: "contact.company_name" })} />
                                </Form.Item></Col>
                                <Col md={24} xs={24}> <Form.Item
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: intl.formatMessage({
                                                id: "contact.email.message",
                                            }),
                                        },
                                    ]}
                                >
                                    <Input placeholder={intl.formatMessage({ id: "contact.email" })} />
                                </Form.Item>
                                </Col>
                                <Col md={24} xs={24}> <Form.Item
                                    name="phone"
                                    rules={[
                                        {
                                            required: true,
                                            message: intl.formatMessage({
                                                id: "contact.phone.message",
                                            }),
                                        },
                                    ]}
                                >
                                    <Input placeholder={intl.formatMessage({ id: "contact.phone" })} />
                                </Form.Item>
                                </Col>
                                <Col md={24} xs={24}>
                                    <Form.Item

                                        name="message"
                                        rules={[
                                            {
                                                required: true,
                                                message: intl.formatMessage({
                                                    id: "contact.message.message",
                                                }),
                                            },
                                        ]}
                                    >
                                        <TextArea rows={3} placeholder={intl.formatMessage({ id: "contact.message" })} style={{ resize: 'none' }} />
                                    </Form.Item>
                                </Col>
                                <Col md={24} xs={24}>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            style={{ height: 44, width: 124 }}
                                        >
                                            GỬI
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </div>
            {/* <div className='home-page-wrapper contact-form form-background'>
                <div  {...dataSource.page} style={{ paddingTop: 60 }}>
                   
                </div>
            </div> */}
        </>
    )
}
