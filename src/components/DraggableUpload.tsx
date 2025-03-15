import { Col, Form, Upload, type ColProps } from 'antd';
import type { FormItemProps } from 'antd/es/form';
import type { UploadListType, UploadProps } from 'antd/es/upload/interface';
import React from 'react';
import IconifyIcon from './IconifyIcon';

interface Props extends FormItemProps {
	label: string;
	name: string;
	maxCount?: number;
	accept?: string;
	listType?: UploadListType;
	colProps?: ColProps;
	uploadProps?: UploadProps;
}

const DraggableUpload: React.FC<Props> = ({
	label,
	name,
	maxCount = 1,
	accept = 'image/*',
	listType = 'picture',
	colProps,
	uploadProps,
	...formItemProps
}) => {
	return (
		<Col {...colProps}>
			<Form.Item
				label={label}
				name={name}
				{...formItemProps}
				valuePropName="fileList"
				getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
			>
				<Upload.Dragger
					accept={accept}
					listType={listType}
					maxCount={maxCount}
					beforeUpload={() => false}
					{...uploadProps}
				>
					<IconifyIcon icon="uil:image-upload" width="32" height="32" />
					<p>Click or drag an image file to this area</p>
				</Upload.Dragger>
			</Form.Item>
		</Col>
	);
};

export default DraggableUpload;
