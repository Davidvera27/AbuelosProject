import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, DatePicker, InputNumber, Collapse, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './Registro.css';

const { TextArea } = Input;
const { Panel } = Collapse;

const Registro = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = new URLSearchParams(window.location.search).get('id');
      if (userId) {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        const userData = await response.json();
        form.setFieldsValue(userData); // Llenar los campos con los datos del usuario
      }
    };
    fetchUserData();
  }, [form]);

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleFinish = async (values) => {
    const userId = new URLSearchParams(window.location.search).get('id');
    try {
      await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      message.success('Registro completado con éxito');
    } catch (error) {
      message.error('Error al actualizar los datos');
    }
  };

  const handleFinishFailed = (errorInfo) => {
    message.error('Por favor, corrige los errores en el formulario');
    console.log('Errores:', errorInfo);
  };

  return (
    <div className="registro-container">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        autoComplete="off"
      >
        <Collapse defaultActiveKey={['1']} accordion>
          {/* Información Personal */}
          <Panel header="Información Personal" key="1">
            <Form.Item
              label="Primer Nombre"
              name="primer_nombre"
              rules={[{ required: true, message: 'Por favor ingrese su primer nombre' }]}
            >
              <Input placeholder="Primer nombre" />
            </Form.Item>

            <Form.Item label="Segundo Nombre" name="segundo_nombre">
              <Input placeholder="Segundo nombre" />
            </Form.Item>

            <Form.Item
              label="Apellidos"
              name="apellidos"
              rules={[{ required: true, message: 'Por favor ingrese sus apellidos' }]}
            >
              <Input placeholder="Apellidos" />
            </Form.Item>

            <Form.Item
              label="Edad"
              name="edad"
              rules={[{ required: true, message: 'Por favor ingrese su edad' }, { type: 'number', min: 1, max: 120 }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Edad" />
            </Form.Item>

            <Form.Item
              label="Fecha de Nacimiento"
              name="fecha_nacimiento"
              rules={[{ required: true, message: 'Por favor seleccione la fecha de nacimiento' }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Panel>

          {/* Información Profesional */}
          <Panel header="Información Profesional" key="2">
            <Form.Item
              label="Cargo"
              name="cargo"
              rules={[{ required: true, message: 'Por favor ingrese su cargo' }]}
            >
              <Input placeholder="Cargo" />
            </Form.Item>

            <Form.Item
              label="Especialidad"
              name="especialidad"
              rules={[{ required: true, message: 'Por favor ingrese su especialidad' }]}
            >
              <Input placeholder="Especialidad" />
            </Form.Item>

            <Form.Item
              label="No. Documento"
              name="no_documento"
              rules={[{ required: true, message: 'Por favor ingrese su documento' }]}
            >
              <Input placeholder="No. Documento" />
            </Form.Item>

            <Form.Item
              label="Tarjeta Profesional"
              name="tarjeta_profesional"
              rules={[{ required: true, message: 'Por favor ingrese su tarjeta profesional' }]}
            >
              <Input placeholder="Tarjeta Profesional" />
            </Form.Item>
          </Panel>

          {/* Otros Datos Requeridos */}
          <Panel header="Otros Datos Requeridos" key="3">
            <Form.Item
              label="Estado"
              name="estado"
              rules={[{ required: true, message: 'Por favor ingrese su estado' }]}
            >
              <Input placeholder="Estado" />
            </Form.Item>

            <Form.Item
              label="Profesión"
              name="profesion"
              rules={[{ required: true, message: 'Por favor ingrese su profesión' }]}
            >
              <Input placeholder="Profesión" />
            </Form.Item>

            <Form.Item
              label="Teléfono"
              name="telefono"
              rules={[{ required: true, message: 'Por favor ingrese su número de teléfono' }]}
            >
              <Input placeholder="Teléfono" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: 'email', message: 'Por favor ingrese un correo válido' }]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              label="Dirección"
              name="direccion"
              rules={[{ required: true, message: 'Por favor ingrese su dirección' }]}
            >
              <TextArea rows={2} placeholder="Dirección" />
            </Form.Item>
          </Panel>

          {/* Subir Foto de Perfil */}
          <Panel header="Subir Foto de Perfil" key="4">
            <Form.Item label="Foto de Perfil" valuePropName="fileList" getValueFromEvent={handleFileChange}>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false} // Prevent automatic upload
              >
                {fileList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Subir</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Panel>
        </Collapse>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Registrar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Registro;
