import React, { useState, useEffect } from 'react';
import { Form, Cascader, Input, Button, Upload, DatePicker, InputNumber, Collapse, Checkbox, message } from 'antd';
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './Registro.css';

const { TextArea } = Input;
const { Panel } = Collapse;

const Registro = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [edad, setEdad] = useState(null);  // Estado para la edad calculada
  const [isAdmin, setIsAdmin] = useState(false);  // Estado para verificar si el usuario es administrador

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

  // Función para calcular la edad usando dayjs
  const calcularEdad = (fechaNacimiento) => {
    if (fechaNacimiento) {
      const today = dayjs();
      const birthDate = dayjs(fechaNacimiento);
      const calculatedAge = today.diff(birthDate, 'year');  // Calcular diferencia en años
      setEdad(calculatedAge);
      form.setFieldsValue({ edad: calculatedAge });
    }
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
      
      // Redirigir al inicio de sesión después del registro exitoso
      window.location.href = 'http://localhost:3000/';  // Cambia esto según tu ruta de inicio de sesión
      
    } catch (error) {
      message.error('Error al actualizar los datos');
    }
  };

  const handleFinishFailed = (errorInfo) => {
    message.error('Por favor, corrige los errores en el formulario');
    console.log('Errores:', errorInfo);
  };

  // Opciones para el cascader de "Cargo", "Especialidad", "Estado" y "Profesión"
  const cargoOptions = [
    { value: 'psicologia', label: 'Psicólogo(a)' },
    { value: 'enfermeria', label: 'Enfermero(a)' },
    { value: 'fisioterapia', label: 'Fisioterapeuta' },
    { value: 'nutricion', label: 'Nutricionista / Nutriologo(a)' },
  ];

  const especialidadOptions = [
    { value: 'opcion1', label: 'Opción 1' },
    { value: 'opcion2', label: 'Opción 2' },
    { value: 'opcion3', label: 'Opción 3' },
    { value: 'opcion4', label: 'Opción 4' },
  ];

  const estadoOptions = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
  ];

  const profesionOptions = [
    { value: 'medicina', label: 'Médico' },
    { value: 'ingenieria', label: 'Ingeniero(a)' },
    { value: 'docencia', label: 'Docente' },
    { value: 'abogacia', label: 'Abogado(a)' },
  ];

  // Función para manejar los cambios en los cascaders
  const onCascaderChange = (value, selectedOptions, fieldName) => {
    let selected = selectedOptions.map(option => option.label).join(' / ');
    if (fieldName === 'cargo' && isAdmin) {
      selected += ' / Administrador';
    }
    form.setFieldsValue({ [fieldName]: selected });
  };

  // Manejar el cambio del checkbox de administrador
  const handleAdminChange = (e) => {
    setIsAdmin(e.target.checked);
    const currentCargo = form.getFieldValue('cargo') || '';
    if (e.target.checked && !currentCargo.includes('Administrador')) {
      form.setFieldsValue({ cargo: currentCargo + ' / Administrador' });
    } else if (!e.target.checked) {
      form.setFieldsValue({ cargo: currentCargo.replace(' / Administrador', '') });
    }
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
              tooltip={{ title: "Escribe tu primer nombre", icon: <InfoCircleOutlined /> }}
              rules={[{ required: true, message: 'Por favor ingrese su primer nombre' }]}
            >
              <Input placeholder="Ej: Juan" />
            </Form.Item>

            <Form.Item
              label="Segundo Nombre"
              name="segundo_nombre"
              tooltip={{ title: "Escribe tu segundo nombre (opcional)", icon: <InfoCircleOutlined /> }}
            >
              <Input placeholder="Ej: Andrés" />
            </Form.Item>

            <Form.Item
              label="Apellidos"
              name="apellidos"
              tooltip={{ title: "Escribe tus apellidos completos", icon: <InfoCircleOutlined /> }}
              rules={[{ required: true, message: 'Por favor ingrese sus apellidos' }]}
            >
              <Input placeholder="Ej: Restrepo Vera" />
            </Form.Item>

            <Form.Item
              label="Fecha de Nacimiento"
              name="fecha_nacimiento"
              tooltip={{ title: "Selecciona tu fecha de nacimiento", icon: <InfoCircleOutlined /> }}
              rules={[{ required: true, message: 'Por favor seleccione la fecha de nacimiento' }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: '100%' }}
                onChange={(date) => calcularEdad(date)}  // Calcular la edad cuando se selecciona una fecha
              />
            </Form.Item>

            <Form.Item
              label="Edad"
              name="edad"
              tooltip={{ title: "Edad calculada automáticamente según tu fecha de nacimiento", icon: <InfoCircleOutlined /> }}
              rules={[{ required: true, message: 'La edad es obligatoria' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Edad" disabled value={edad} />
            </Form.Item>
          </Panel>

          {/* Información Profesional */}
          <Panel header="Información Profesional" key="2">
            <Form.Item
              label="Cargo"
              name="cargo"
              tooltip={{ title: "Selecciona tu cargo", icon: <InfoCircleOutlined /> }}
              rules={[{ required: true, message: 'Por favor seleccione su cargo' }]}
            >
              <Cascader
                options={cargoOptions}
                onChange={(value, selectedOptions) => onCascaderChange(value, selectedOptions, 'cargo')}
                expandTrigger="hover"
                placeholder="Seleccione un cargo"
              />
            </Form.Item>

            <Form.Item>
              <Checkbox onChange={handleAdminChange}>¿Es administrador?</Checkbox>
            </Form.Item>

            <Form.Item
              label="Especialidad"
              name="especialidad"
              tooltip={{ title: "Selecciona tu especialidad", icon: <InfoCircleOutlined /> }}
              rules={[{ required: true, message: 'Por favor seleccione su especialidad' }]}
            >
              <Cascader
                options={especialidadOptions}
                onChange={(value, selectedOptions) => onCascaderChange(value, selectedOptions, 'especialidad')}
                expandTrigger="hover"
                placeholder="Seleccione una especialidad"
              />
            </Form.Item>

            <Form.Item
              label="No. Documento"
              name="no_documento"
              tooltip={{ title: "Ingrese su número de documento", icon: <InfoCircleOutlined /> }}
              rules={[{ required: true, message: 'Por favor ingrese su documento' }]}
            >
              <Input placeholder="Ej: 12345678" />
            </Form.Item>

            <Form.Item
              label="Tarjeta Profesional"
              name="tarjeta_profesional"
              tooltip={{ title: "Ingrese su tarjeta profesional", icon: <InfoCircleOutlined /> }}
              rules={[{ required: true, message: 'Por favor ingrese su tarjeta profesional' }]}
            >
              <Input placeholder="Ej: TP-123456" />
            </Form.Item>
          </Panel>

          {/* Otros Datos Requeridos */}
          <Panel header="Otros Datos Requeridos" key="3">
            <Form.Item
              label="Estado"
              name="estado"
              tooltip={{ title: "Seleccione su estado", icon: <InfoCircleOutlined /> }}
              rules={[{ required: true, message: 'Por favor seleccione su estado' }]}
            >
              <Cascader
                options={estadoOptions}
                onChange={(value, selectedOptions) => onCascaderChange(value, selectedOptions, 'estado')}
                expandTrigger="hover"
                placeholder="Seleccione un estado"
              />
            </Form.Item>

            <Form.Item
              label="Profesión"
              name="profesion"
              tooltip={{ title: "Seleccione su profesión", icon: <InfoCircleOutlined /> }}
              rules={[{ required: true, message: 'Por favor seleccione su profesión' }]}
            >
              <Cascader
                options={profesionOptions}
                onChange={(value, selectedOptions) => onCascaderChange(value, selectedOptions, 'profesion')}
                expandTrigger="hover"
                placeholder="Seleccione una profesión"
              />
            </Form.Item>

            <Form.Item
              label="Teléfono"
              name="telefono"
              tooltip={{ title: "Ingrese su número de teléfono", icon: <InfoCircleOutlined /> }}
              rules={[{ required: true, message: 'Por favor ingrese su número de teléfono' }]}
            >
              <Input placeholder="Ej: +573001234567" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              tooltip={{ title: "Ingrese un correo electrónico válido", icon: <InfoCircleOutlined /> }}
              rules={[{ required: true, type: 'email', message: 'Por favor ingrese un correo válido' }]}
            >
              <Input placeholder="correo@example.com" />
            </Form.Item>

            <Form.Item
              label="Dirección"
              name="direccion"
              tooltip={{ title: "Ingrese su dirección", icon: <InfoCircleOutlined /> }}
              rules={[{ required: true, message: 'Por favor ingrese su dirección' }]}
            >
              <TextArea rows={2} placeholder="Ej: Calle 123 #45-67, Ciudad, País" />
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
