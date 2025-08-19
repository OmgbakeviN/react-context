import React from 'react';
import { Col, Row, Progress } from 'reactstrap';
import { H6, Image, LI, P, UL } from '../../../../AbstractElements';
import { Issues, Resolved, Comment, Done } from '../../../../Constant';

const CusClass = ({ item }) => {
  return (
    
      <div className='project-box' style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Gradient accent bar at top */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #4CAF50 0%, #2196F3 50%, #F44336 100%)'
        }}></div>
        
        {/* <span className={`badge ${item.badge === 'Done' ? 'badge-success' : 'badge-primary'}`}>{item.badge}</span> */}
        
        <H6 style={{
          color: '#333',
          fontSize: '18px',
          marginBottom: '15px',
          fontWeight: '600',
          borderLeft: '4px solid #2196F3',
          paddingLeft: '10px'
        }}>Nom de Projet: {item.libelle}</H6>
        
        <div className='media' style={{ marginBottom: '15px' }}>
          {/* <Image attrImage={{ className: 'img-20 me-1 rounded-circle', src: `${require(`../../../../assets/images/${item.img}`)}`, alt: '' }} /> */}
          <div className='media-body'>
            <P style={{
              color: '#555',
              fontSize: '14px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <span style={{ backgroundColor: '#E8F5E9', padding: '3px 8px', borderRadius: '4px', color: '#2E7D32' }}>
                Type: {item.type}
              </span>
              <span style={{ backgroundColor: '#E3F2FD', padding: '3px 8px', borderRadius: '4px', color: '#1565C0' }}>
                Annee D'exercice: {item.exercice}
              </span>
            </P>
          </div>
        </div>
        
        <P style={{
          backgroundColor: '#FFF3E0',
          padding: '10px',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#E65100',
          marginBottom: '15px'
        }}>
          Donnees du Projet {item.libelle} | Convention: {item.numero_convention}
        </P>
        
        <Row className='details' style={{ marginBottom: '15px' }}>
          <Col xs='6' style={{ padding: '5px' }}>
            <span style={{ color: '#757575', fontSize: '13px' }}>{Issues} </span>
          </Col>
          <Col xs='6' style={{ padding: '5px' }} className={item.badge === 'Done' ? 'font-success' : 'font-primary'}>
            <span style={{ fontWeight: '500', color: '#4CAF50' }}>{item.montant_ht}</span>
          </Col>
          
          <Col xs='6' style={{ padding: '5px' }}>
            <span style={{ color: '#757575', fontSize: '13px' }}>{Resolved}</span>
          </Col>
          <Col xs='6' style={{ padding: '5px' }} className={item.badge === 'Done' ? 'font-success' : 'font-primary'}>
            <span style={{ fontWeight: '500', color: '#2196F3' }}>{item.date_debut}</span>
          </Col>
          
          <Col xs='6' style={{ padding: '5px' }}>
            <span style={{ color: '#757575', fontSize: '13px' }}>{Comment}</span>
          </Col>
          <Col xs='6' style={{ padding: '5px' }} className={item.badge === 'Done' ? 'font-success' : 'font-primary'}>
            <span style={{ fontWeight: '500', color: '#F44336' }}>{item.date_fin}</span>
          </Col>
          
          <Col xs='6' style={{ padding: '5px' }}>
            <span style={{ color: '#757575', fontSize: '13px' }}>Entreprise: </span>
          </Col>
          <Col xs='6' style={{ padding: '5px' }} className={item.badge === 'Done' ? 'font-success' : 'font-primary'}>
            <span style={{ fontWeight: '500' }}>{item.entreprise}</span>
          </Col>
          
          <Col xs='6' style={{ padding: '5px' }}>
            <span style={{ color: '#757575', fontSize: '13px' }}>Commune: </span>
          </Col>
          <Col xs='6' style={{ padding: '5px' }} className={item.badge === 'Done' ? 'font-success' : 'font-primary'}>
            <span style={{ fontWeight: '500' }}>{item.commune}</span>
          </Col>
        </Row>
        
        {/* <div className='customers'>
          <UL attrUL={{ className: 'd-inline-block' }}>
            <LI attrLI={{ className: 'd-inline-block border-0' }}>
              <Image attrImage={{ className: 'img-30 rounded-circle', src: `${require(`../../../../assets/images/${item.customers_img1}`)}`, alt: '' }} />
            </LI>
            <LI attrLI={{ className: 'd-inline-block border-0' }}>
              <Image attrImage={{ className: 'img-30 rounded-circle', src: `${require(`../../../../assets/images/${item.customers_img2}`)}`, alt: '' }} />
            </LI>
            <LI attrLI={{ className: 'd-inline-block border-0' }}>
              <Image attrImage={{ className: 'img-30 rounded-circle', src: `${require(`../../../../assets/images/${item.customers_img3}`)}`, alt: '' }} />
            </LI>
            <LI attrLI={{ className: 'd-inline-block ms-2 border-0' }}>
              <P attrPara={{ className: 'f-12' }}>{`+${item.like} More`}</P>
            </LI>
          </UL>
        </div> */}
        
        <div className='project-status mt-4'>
          <div className='media mb-0' style={{ marginBottom: '5px' }}>
            <P style={{ color: '#616161', fontSize: '14px' }}>Completion: {item.commune}% </P>
            {/* <div className='media-body text-end'>
              <span>{Done}</span>
            </div> */}
          </div>
          {item.commune === '100' ? 
            <Progress className='sm-progress-bar' color='success' value={item.commune} style={{ 
              height: '8px',
              borderRadius: '4px',
              backgroundColor: '#E0E0E0'
            }} /> 
            : 
            <Progress className='sm-progress-bar' striped color='primary' value={item.commune} style={{ 
              height: '8px',
              borderRadius: '4px',
              backgroundColor: '#E0E0E0'
            }} />
          }
        </div>
      </div>
    
  );
};

export default CusClass;