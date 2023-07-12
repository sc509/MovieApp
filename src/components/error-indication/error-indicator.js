import './error-indicator.scss'
import { Alert, Space } from 'antd';
const ErrorIndicator = () => {
    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Alert
                message="Ошибка"
                description="К сожалению, данный сервис сейчас недоступен."
                type="error"
                closable
            />
        </Space>

    )
}

export default ErrorIndicator;