import type { FC } from 'react';
import { useState } from 'react';
import { Space, Button, message, Spin } from 'antd';
import useArtAddStore, {
  setCurrent,
  Move,
  selectContent,
  setContent,
} from '@/store/art-add-store.ts';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './css/art-content.module.less';
import { setArticleState } from '@/store/art-add-store.ts';
import { useSubmit } from 'react-router-dom';
import { useNavSubmitting } from '@/utils/hooks';

export const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ['clean'], // remove formatting button
  ],
};

const ArticleContent: FC = () => {
  const value = useArtAddStore(selectContent);
  const submit = useSubmit();
  const submitting = useNavSubmitting('POST');
  // 按钮的点击事件处理函数
  const publish = (state: '草稿' | '已发布') => {
    if (!value) return message.error('请填写文章的内容！');
    console.log(value, state);
    setArticleState(state);
    submit(null, { method: 'POST' });
  };

  return (
    <div className={styles.artContent}>
      <Spin spinning={submitting} delay={200}>
        <Space direction='vertical' style={{ display: 'flex' }}>
          <ReactQuill
            theme='snow'
            value={value}
            onChange={setContent}
            modules={modules}
          />

          {/* 按钮区域 */}
          <Space direction='horizontal'>
            <Button type='primary' onClick={() => setCurrent(Move.prev)}>
              上一步
            </Button>
            <Button type='primary' onClick={() => publish('草稿')}>
              存为草稿
            </Button>
            <Button type='primary' onClick={() => publish('已发布')}>
              发布
            </Button>
          </Space>
        </Space>
      </Spin>
    </div>
  );
};

export default ArticleContent;
