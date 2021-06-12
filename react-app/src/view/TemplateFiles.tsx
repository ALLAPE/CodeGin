import {TemplateFile} from '../model/template-file';
import {List, ListItem, ListItemText, Typography} from '@material-ui/core';
import LoadingContainer from '../component/loading/LoadingContainer';
import DateString from '../component/date/DateString';
import React, {useCallback, useEffect, useState} from 'react';
import {PromiseHandlerFunction} from '../component/loading/promise-handler';
import {getSavedTplFiles} from '../api/api';

interface TemplateFilesProps {
  // 重新加载key
  reloadKey?: number;
  // 点击元素时
  onItemClick: (file: TemplateFile) => void;

  // 其他必要工具
  promiseHandler: PromiseHandlerFunction;
  loading: boolean;
}

export default function TemplateFiles(props: TemplateFilesProps) {
  const { reloadKey, onItemClick, promiseHandler, loading } = props;

  const [templateFiles, setTemplateFiles] = useState<TemplateFile[]>([]);

  const getTemplateFiles = useCallback(() => {
    promiseHandler(getSavedTplFiles()).then(files => setTemplateFiles(files));
  }, [promiseHandler]);

  const onClick = useCallback((file: TemplateFile) => {
    if (onItemClick) {
      onItemClick(file);
    }
  }, [onItemClick]);

  useEffect(() => {
    getTemplateFiles();
  }, [getTemplateFiles, reloadKey]);

  return <>
    <LoadingContainer style={{padding: '5px 5px 0', margin: '5px 0 0'}} loading={loading}>
      {templateFiles.length === 0 ? <Typography variant="body1" color="textSecondary" align="center">暂无数据</Typography> : <></>}
      <List component="nav">
        {templateFiles.map((file, index) =>
          <ListItem key={index} button onClick={() => onClick(file)}>
            <ListItemText primary={<span>
                                        <DateString date={file.createTime} />
                                        <span>&nbsp;&nbsp;&nbsp;&nbsp;{file.id}</span>
                                      </span>}
                          secondary={<DateString date={file.updateTime} />} />
          </ListItem>)
        }
      </List>
    </LoadingContainer>
  </>;
}
