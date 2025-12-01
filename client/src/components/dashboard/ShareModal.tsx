import styled from 'styled-components';
import { QRCodeSVG } from 'qrcode.react';
import Button from '../common/Button';
import { useState } from 'react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    username: string;
}

const Overlay = styled.div<{ isOpen: boolean }>`
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContainer = styled.div`
    background-color: white;
    padding: 32px;
    border-radius: 16px;
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    color: ${({ theme }) => theme.colors.neutral.black};
`;

const QRContainer = styled.div`
    display: flex;
    justify-content: center;
    padding: 16px;
    background-color: #f8f9fa;
    border-radius: 12px;
`;

const UrlContainer = styled.div`
    display: flex;
    gap: 8px;
`;

const Input = styled.input`
    flex: 1;
    padding: 10px 12px;
    border: 1px solid ${({ theme }) => theme.colors.neutral.border};
    border-radius: 6px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.neutral.gray600};
    background-color: #f8f9fa;
    outline: none;
`;

const ShareModal = ({ isOpen, onClose, username }: ShareModalProps) => {
    const [copied, setCopied] = useState(false);
    
    // 현재 도메인 + 사용자 페이지 경로
    const pageUrl = `${window.location.origin}/page/${username}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(pageUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
            alert('복사에 실패했습니다. 직접 복사해주세요.');
        }
    };

    if (!isOpen) return null;

    return (
        <Overlay isOpen={isOpen} onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <Title>내 페이지 공유하기</Title>
                
                <QRContainer>
                    <QRCodeSVG 
                        value={pageUrl} 
                        size={200}
                        level={"H"}
                        includeMargin={true}
                    />
                </QRContainer>
                
                <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
                    QR코드를 스캔하거나 링크를 복사하여<br/>클라이언트에게 전달해보세요!
                </div>

                <UrlContainer>
                    <Input readOnly value={pageUrl} />
                    <Button size="sm" onClick={handleCopy}>
                        {copied ? '복사됨!' : '복사'}
                    </Button>
                </UrlContainer>

                <Button variant="outline" onClick={onClose}>
                    닫기
                </Button>
            </ModalContainer>
        </Overlay>
    );
};

export default ShareModal;

