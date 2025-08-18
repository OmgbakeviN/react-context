import React from 'react';
import { Col, Row, Progress } from 'reactstrap';
import { H6, Image, LI, P, UL } from '../../../../AbstractElements';
import { Issues, Resolved, Comment, Done } from '../../../../Constant';

const CusClass = ({ item }) => {
  return (
    <Col className='col-xxl-4' md='6'>
      <div className='project-box'>
        {/* <span className={`badge ${item.badge === 'Done' ? 'badge-success' : 'badge-primary'}`}>{item.badge}</span> */}
        <H6>Nom de Projet: {item.libelle}</H6>
        <div className='media'>
          {/* <Image attrImage={{ className: 'img-20 me-1 rounded-circle', src: `${require(`../../../../assets/images/${item.img}`)}`, alt: '' }} /> */}
          <div className='media-body'>
            <P>Type: {item.type} | Annee D'exercice: {item.exercice} </P>
          </div>
        </div>
        <P>Donnees du Projet {item.libelle} Convention: {item.numero_convention}</P>
        <Row className='details'>
          <Col xs='6'>
            <span>{Issues} </span>
          </Col>
          <Col xs='6' className={item.badge === 'Done' ? 'font-success' : 'font-primary'}>
            {item.montant_ht}
          </Col>
          <Col xs='6'>
            {' '}
            <span>{Resolved}</span>
          </Col>
          <Col xs='6' className={item.badge === 'Done' ? 'font-success' : 'font-primary'}>
            {item.date_debut}
          </Col>
          <Col xs='6'>
            {' '}
            <span>{Comment}</span>
          </Col>
          <Col xs='6' className={item.badge === 'Done' ? 'font-success' : 'font-primary'}>
            {item.date_fin}
          </Col>
          <Col xs='6'>
            {' '}
            <span>Entreprise: </span>
          </Col>
          <Col xs='6' className={item.badge === 'Done' ? 'font-success' : 'font-primary'}>
            {item.entreprise}
          </Col>
          <Col xs='6'>
            {' '}
            <span>Commune: </span>
          </Col>
          <Col xs='6' className={item.badge === 'Done' ? 'font-success' : 'font-primary'}>
            {item.commune}
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
          <div className='media mb-0'>
            <P>Completion: {item.commune}% </P>
            {/* <div className='media-body text-end'>
              <span>{Done}</span>
            </div> */}
          </div>
          {item.commune === '100' ? <Progress className='sm-progress-bar' color='success' value={item.commune} style={{ height: '5px' }} /> : <Progress className='sm-progress-bar' striped color='primary' value={item.commune} style={{ height: '5px' }} />}
        </div>
      </div>
    </Col>
  );
};

export default CusClass;
