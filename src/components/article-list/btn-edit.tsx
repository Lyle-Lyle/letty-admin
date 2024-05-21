import type { FC } from 'react';
import { Button } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const BtnEditAritcle: FC<{ id: number }> = ({ id }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Button
      type='link'
      size='small'
      onClick={() => navigate('/art-edit/' + id, { state: location.search })}
    >
      修改
    </Button>
  );
};

export default BtnEditAritcle;
